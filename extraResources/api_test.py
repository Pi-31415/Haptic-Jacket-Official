import hapticAPI

hapticAPI.initiate_config()
hapticAPI.show_modules()

hapticAPI.activate_motor(1)
hapticAPI.delay(1)
stop_all_motors()

hapticAPI.activate_motor(2)
hapticAPI.delay(1)
stop_all_motors()

hapticAPI.activate_motor(3)
hapticAPI.delay(1)
stop_all_motors()
