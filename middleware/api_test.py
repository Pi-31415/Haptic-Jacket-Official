import hapticAPI

hapticAPI.activate_motor(1)
hapticAPI.delay(1)
hapticAPI.activate_motor(2)
hapticAPI.delay(1)
hapticAPI.activate_motor(3)
hapticAPI.delay(1)
hapticAPI.activate_motor(4)
hapticAPI.delay(3)
hapticAPI.continuous_motion(0.2,20)