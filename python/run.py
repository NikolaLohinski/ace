import os
import json
import argparse
from PyAce import run_scenario

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--constants-path', type=str, required=True,
                        help='Full path to constants.json file')
    parser.add_argument('-s', '--scenario-path', type=str, required=True,
                        help='Full path to a scenarios to execute. Either a file'
                             ' or a directory')
    args = parser.parse_args()
    with open(args.constants_path, 'r') as buffer:
        constants = json.load(buffer)
    scenarios = [args.scenario_path]
    if os.path.isdir(args.scenario_path):
        scenarios = [
            os.path.join(args.scenario_path, name)
            for name in sorted(os.listdir(args.scenario_path))
        ]
    for path in scenarios:
        with open(path, 'r') as buffer:
            scenario = json.load(buffer)
        print('\nNow running scenario : {}'.format(os.path.basename(path)))
        run_scenario(scenario=scenario, constants=constants)
