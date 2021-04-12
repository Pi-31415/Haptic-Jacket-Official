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


# UDP Configuration
UDP_IP = "127.0.0.1"
UDP_PORT = 33333

def initiate_config():
    # Read the contents of config.csv and read it into dictionary
    with open('config.csv') as f:
        reader = enumerate(csv.reader(f))
        for i, row in reader:
            print(i, row) 
    print('Done')


def send_UDP_message(message):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Internet  # UDP
    sock.sendto(message, (UDP_IP, UDP_PORT))

def activate_motor(motor_id):
    COMMAND = bytes(str(motor_id),'utf-8')
    send_UDP_message(COMMAND)
    print("Motor %s Activated" % motor_id)

def stop_all_motors():
    COMMAND = bytes('0','utf-8')
    send_UDP_message(COMMAND)
    print("All Motors Stopped")

def continuous_motion(delay_time,maximum_motor_id):
    x = 1
    while True:
        stop_all_motors()
        activate_motor(x)
        #Delay the time between motors in seconds
        sleep(delay_time)
        x += 1
        if(x>=maximum_motor_id):
            x=1

def delay(delay_time):
    sleep(delay_time)