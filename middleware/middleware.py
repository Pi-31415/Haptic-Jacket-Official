'''
Author : Pi 
Date: Mar 27, 2021
Description:  This is the Haptic Jacket controller middleware in Python
Dependencies : socket
'''


import socket
from time import sleep

UDP_IP = "127.0.0.1"
UDP_PORT = 33333

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

def continuous_motion(delay_time):
    x = 1
    while True:
        stop_all_motors()
        activate_motor(x)
        #Delay the time between motors in seconds
        sleep(delay_time)
        x += 1
        if(x>=20):
            x=1

activate_motor(1)
sleep(1)
activate_motor(2)
sleep(1)
activate_motor(3)
sleep(1)
activate_motor(4)
sleep(5)
continuous_motion(0.2)