'''
Author : Pi 
Date: Mar 27, 2021
Description:  This is the Haptic Jacket controller middleware in Python
Dependencies : socket
'''


import socket

UDP_IP = "127.0.0.1"
UDP_PORT = 33333

def activate_motor(motor_id):
    COMMAND = motor_id
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Internet  # UDP
    sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
    print("message: %s" % COMMAND)

activate_motor(1)