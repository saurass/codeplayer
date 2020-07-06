import boto3
import os
from Compiler import Compiler
import epicbox
import socketio
import urllib.request
from rsmq.consumer import RedisSMQConsumer
import simplejson as json
import requests
from dotenv import load_dotenv
load_dotenv()
import ast


class Worker:
    # To be initailized in constructor
    compiler = None
    inputs = None
    outputs = None
    untrusted_code = None
    code_lang = None
    redis_consumer = None
    s3 = None
    sio = None
    user_id = None
    submission_id = None
    memorylimit = 256
    timelimit = 5

    # Will be called when new worker in initialized
    def __init__(self):
        self.compiler = Compiler.getInstance()
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_IAM_KEY'),
            aws_secret_access_key=os.getenv('AWS_IAM_SECRET')
        )
        # connect to socket server
        self.sio = socketio.Client()
        self.sio.connect(os.getenv("APP_SERVER"))

    # call this to inititalize This Worker
    def boot(self):
        self.redis_consumer = RedisSMQConsumer(
            'submissions', self.fetchResourcesAndProcess, host=os.getenv("REDISHOST"))
        self.redis_consumer.run()

    # Fetch inputs (Array of links), outputs (Array of links), untrusted_code (link to the code)
    def fetchResourcesAndProcess(self, id, message, rc, ts):

        # we get only submission ID from queue
        queuedata = message.split("::")
        print(queuedata)

        self.user_id = queuedata[0]
        self.submission_id = queuedata[1]

        self.sio.emit("joinroom", self.user_id)

        # we request api server
        ques_details_response = requests.get(
            os.getenv("APP_SERVER") + '/worker/testdata/' + self.submission_id)
        ques_data = json.loads(ques_details_response.text)

        self.inputs = ques_data['inputs']
        self.outputs = ques_data['outputs']
        self.code_lang = ques_data['lang']
        self.untrusted_code = ques_data['code']
        self.memorylimit = ques_data['memorylimit']
        self.timelimit = ques_data['timelimit']

        self.compilerInitialSetup()

        if(self.code_lang == "c++"):
            self.processCompileAndRun()
        elif(self.code_lang == "python"):
            self.processDirectRun()
        else:
            self.pingMessage({error: "LR", message: "Language Rejected"})
        
        self.sio.emit("leaveroom", self.user_id)
        return True

    # Perform some initial setup for compiler
    def compilerInitialSetup(self):
        self.compiler.setCompilerLang(self.code_lang)
        self.compiler.setCompilerMemoryLimit(self.memorylimit)
        self.compiler.setCompilerTimeLimit(self.timelimit)
        self.compiler.makeProfiles()


    # Use this when required to compile first and then execute like in C++ and Java
    def processCompileAndRun(self):
        with epicbox.working_directory() as working_dir:
            self.pingMessage(
                {"success": "CMPL", "message": "Compiling your code"})
            compile_result = self.compiler.compile(
                working_dir, self.untrusted_code)
            if(compile_result["exit_code"] != 0):
                return self.pingMessage({"error": "CE", "message": compile_result["stderr"]})
            self.pingMessage(
                {"success": "CMPLS", "message": "Compilation Success"})

            testcase_number = 0
            for input in self.inputs:
                testcase_number = testcase_number + 1

                self.pingMessage(
                    {"success": "RUN", "message": "Running on testcase #" + str(testcase_number)})
                run_result = self.compiler.run(working_dir, input)

                if(run_result["oom_killed"] or run_result["timeout"] or run_result["exit_code"]):
                    return self.pingRunError(run_result, testcase_number)

                print(run_result)
                eval_result = self.matchOutput(
                    run_result["stdout"], self.outputs[testcase_number - 1])
                if(eval_result == False):
                    return self.pingMessage({"error": "WA", "message": "Wrong answer on testcase #" + str(testcase_number)})

                self.pingMessage(
                    {"success": "ACS", "message": "Correct on testcase #" + str(testcase_number)})

            return self.pingMessage({"success": "AC", "message": "Accepted Solution"})

    # Use this for languages where we can direct run the code like python
    def processDirectRun(self):
        self.pingMessage(
            {"success": "CMPL", "message": "Evaluating Your Code"})

        testcase_number = 0
        for input in self.inputs:
            testcase_number = testcase_number + 1

            self.pingMessage(
                {"success": "RUN", "message": "Running on testcase #" + str(testcase_number)})
            run_result = self.compiler.directRun(self.untrusted_code, input)

            if(run_result["oom_killed"] or run_result["timeout"] or run_result["exit_code"]):
                return self.pingRunError(run_result, testcase_number)

            print(run_result)
            eval_result = self.matchOutput(
                run_result["stdout"], self.outputs[testcase_number - 1])
            if(eval_result == False):
                return self.pingMessage({"error": "WA", "message": "Wrong answer on testcase #" + str(testcase_number)})

            self.pingMessage(
                {"success": "ACS", "message": "Correct on testcase #" + str(testcase_number)})

        return self.pingMessage({"success": "AC", "message": "Accepted Solution"})

    def matchOutput(self, user_output, expected_output):
        user_output = user_output.strip()
        expected_output = self.readFile(expected_output).strip()
        if(user_output == expected_output):
            return True
        return False

    def pingRunError(self, run_result, testcase_number):
        print(run_result)
        if((run_result["timeout"] and run_result["duration"] > self.timelimit + 1) or run_result["oom_killed"]):
            return self.pingMessage({"error": "MLE", "message": "Memory Limit Exceed on testcase #" + str(testcase_number)})
        elif(run_result["timeout"]):
            return self.pingMessage({"error": "TLE", "message": "Time Limit Exceed on testcase #" + str(testcase_number)})
        else:
            return self.pingMessage({"error": "RE", "message": "Run Time Error on testcase #" + str(testcase_number)})

    def pingMessage(self, message):
        message["userId"] = self.user_id
        message["submissionId"] = self.submission_id
        self.sio.emit("status", json.dumps(message))
        # print(message)
        return True

    def readFile(self, file_link):
        data = self.s3.get_object(
            Bucket=os.getenv("AWS_S3_BUCKET"), Key=file_link)
        return data["Body"].read()
