import hapticAPI

hapticAPI.initiate_config()
hapticAPI.show_modules()

# activate_motor(module_id,intensity,duration) Intensity = 0 to 100, 
# Duration in milliseconds
# hapticAPI.delay(Duration in milliseconds)


hapticAPI.activate_motor(1,100,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(2,100,5000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,90,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,80,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,70,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,60,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,50,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,40,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,30,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,20,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,10,1000)
hapticAPI.delay(200)
hapticAPI.activate_motor(1,0,1000)
hapticAPI.delay(200)
