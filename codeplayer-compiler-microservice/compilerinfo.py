compiler_info = {
    "c++": {
        "docker_image": "stepik/epicbox-gcc:6.3.0",
        "compile_cmd": "g++ -pipe -static -O2 -std=c++14 -w solution.cpp -o solution",
        "run_cmd": "./solution",
    },
    "python": {
        "docker_image": "python:3.6.5-alpine",
        "compile_cmd": "NA",
        "run_cmd": "python3 ./solution.py",
    }
}