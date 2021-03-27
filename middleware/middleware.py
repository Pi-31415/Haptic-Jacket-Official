'''
Author : Pi 
Date: Mar 27, 2021
Description:  This is the Haptic Jacket controller middleware in Python
Dependencies : socket
'''


import socket

UDP_IP = "127.0.0.1"
UDP_PORT = 33333
COMMAND = b"1"


print("message: %s" % COMMAND)

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Internet  # UDP
sock.sendto(COMMAND, (UDP_IP, UDP_PORT))
