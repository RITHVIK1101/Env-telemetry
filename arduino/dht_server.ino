#include <Servo.h>
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11

Servo myServo;
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(9600);
    dht.begin();
    myServo.attach(9);
}

void loop()
{
    delay(2000);

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t))
        return;

    Serial.print("Hum: ");
    Serial.println(h);

    if (h > 30)
    {
        myServo.write(90);
    }
    else
    {
        myServo.write(0);
    }
}