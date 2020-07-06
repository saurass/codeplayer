import boto3
import os
from compilerinfo import compiler_info
import epicbox
import urllib.request
from dotenv import load_dotenv
load_dotenv()


class Compiler:
    __instance = None
    compiler_info = None
    PROFILES = None
    s3 = None
    memorylimit = 256
    timelimit = 5

    def __init__(self):
        Compiler.__instance = self
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_IAM_KEY'),
            aws_secret_access_key=os.getenv('AWS_IAM_SECRET')
        )

    @staticmethod
    def getInstance():
        if Compiler.__instance == None:
            Compiler()
        return Compiler.__instance

    def setCompilerLang(self, code_lang):
        self.compiler_info = compiler_info[code_lang]

    def setCompilerMemoryLimit(self, memorylimit):
        self.memorylimit = memorylimit

    def setCompilerTimeLimit(self, timelimit):
        self.timelimit = timelimit

    def makeProfiles(self, user = "sandbox"):
        self.PROFILES = {
            'compile': {
                'docker_image': self.compiler_info['docker_image'],
                'user': 'root',
            },
            'run': {
                'docker_image': self.compiler_info['docker_image'],
                'user': user,
                'read_only': True,
                'network_disabled': False
            },
            'directRun': {
                'docker_image': self.compiler_info['docker_image']
            }
        }
        epicbox.configure(profiles=self.PROFILES)

    def compile(self, work_dir, untrusted_code):
        return epicbox.run('compile', self.compiler_info["compile_cmd"],
                           files=[{'name': 'solution.cpp',
                                   'content': self.readFile(untrusted_code)}],
                            limits={'cputime': 60, 'memory': 2048},
                           workdir=work_dir)

    def run(self, work_dir, testcase):
        return epicbox.run('run', self.compiler_info["run_cmd"], stdin=self.readFile(testcase),
                           limits={'cputime': self.timelimit, 'memory': self.memorylimit},
                           workdir=work_dir)

    def directRun(self, untrusted_code, testcase):
        return epicbox.run('directRun', self.compiler_info["run_cmd"], stdin=self.readFile(testcase),
                           files=[{'name': 'solution.py',
                                   'content': self.readFile(untrusted_code)}],
                            limits={'cputime': self.timelimit, 'memory': self.memorylimit})

    def readFile(self, file_link):
        data = self.s3.get_object(
            Bucket=os.getenv("AWS_S3_BUCKET"), Key=file_link)
        return data["Body"].read()
