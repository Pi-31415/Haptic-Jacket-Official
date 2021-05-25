import hapticAPI

hapticAPI.initiate_config()
hapticAPI.show_modules()

# activate_motor(module_id,intensity,duration) Intensity = 0 to 100,
# Duration in milliseconds
# hapticAPI.delay(Duration in milliseconds)


hapticAPI.activate_motor(1, 100, 4000)
hapticAPI.activate_motor(3, 60, 7000)
hapticAPI.delay(11000)
# Interpreter stops here, should not happen
hapticAPI.activate_motor(4, 30, 3000)



# Notes from George
# Delay - introduce
# If we are to do this decentralized, won't be able to wake up
# if we put to sleep
# Probably need to change sleep function.
# Because if we have a haptic loop at a frequency

# Have a loop with a time check instead of interpreter sleeping
# Whenever we call the delay function, it should not 
# Maybe delay function raise a flag
# !!! Keep the haptic loop running.


# Or call delay from another script
# In the application, the application won't start if it 
# is less than 3 modules
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 


