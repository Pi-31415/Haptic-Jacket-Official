'''
Author : Pi 
Date: Mar 27, 2021
Description:  This is the Haptic Jacket controller middleware API in Python
Dependencies : socket, time, csv

Note : Requires Python 3
'''

import socket
import csv
from time import sleep

# Dictionary of Available Modules
modules = {}

# This is the default UDP for communicating with GUI application, not physicalmodules
GUI_IP = "127.0.0.1"
GUI_PORT = 33333


def initiate_config():
    # Read the contents of config.csv and read it into dictionary
    # This dictionary is for communicating with physical modules
    with open('config.csv') as f:
        reader = enumerate(csv.reader(f))
        for i, row in reader:
            print(i, row)
            if i != 0:
                current_module = dict({'IP': str(row[1]), 'PORT': int(row[2])})
                modules[i] = current_module
    print('Done')


def show_modules():
    # Show all configuration data read from config.csv
    for module_id in modules.keys():
        id = module_id
        print(id, modules[module_id]['IP'],
              modules[module_id]['PORT'])


def send_UDP_message(message,physical_module_ip,physical_module_port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # Internet  # UDP
    # Send the UDP message to GUI Application first, for visualization
    sock.sendto(message, (GUI_IP, GUI_PORT))
    # Then send the message to actual physical modules (0 is off, and anything apart from 0 is on)
    # sock.sendto(message, (physical_module_ip, physical_module_port))

def activate_motor(module_id):
    COMMAND = bytes(str(module_id), 'utf-8')
    send_UDP_message(COMMAND,modules[module_id]['IP'],modules[module_id]['PORT'])
    print("Motor %s Activated" % module_id)


def stop_all_motors():
    COMMAND = bytes('0', 'utf-8')
    for module_id in modules.keys():
        send_UDP_message(COMMAND,modules[module_id]['IP'],modules[module_id]['PORT'])
    print("All Motors Stopped")


def continuous_motion(delay_time):
    x = 1
    while True:
        stop_all_motors()
        activate_motor(x)
        # Delay the time between motors in seconds
        sleep(delay_time)
        x += 1
        if(x > len(modules)):
            x = 1


def delay(delay_time):
    sleep(delay_time)
