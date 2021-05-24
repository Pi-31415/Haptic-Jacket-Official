import hapticAPI

hapticAPI.initiate_config()
hapticAPI.show_modules()

# activate_motor(module_id,intensity,duration) Intensity = 0 to 100, 
# Duration in milliseconds
# hapticAPI.delay(Duration in milliseconds)


hapticAPI.activate_motor(1,90,5000)
hapticAPI.activate_motor(2,100,5000)
hapticAPI.activate_motor(1,80,5000)

