import hapticAPI

hapticAPI.initiate_config()
hapticAPI.show_modules()

# activate_motor(module_id,intensity,duration) Intensity = 0 to 100,
# Duration in milliseconds
# hapticAPI.delay(Duration in milliseconds)


hapticAPI.activate_motor(1, 100, 4000)
hapticAPI.activate_motor(3, 60, 7000)
hapticAPI.activate_motor(4, 30, 3000)
