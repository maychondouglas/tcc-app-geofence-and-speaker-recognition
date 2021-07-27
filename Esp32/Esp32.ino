/**
 * Descrição: Código em Execução no Módulo do ESP32
 * Autor: Maychon Douglas // @maychondouglas
 * Data: 2021/1
 */


//Importando as bibliotecas que serão utilizadas
#include <WiFi.h>
#include <FirebaseESP32.h>

//Informações referentes a rede WiFi
#define WIFI_SSID "XXXXXXXX" 
#define WIFI_PASSWORD "XXXXXXXX"

//Informações para autenticação no Firebase
#define FIREBASE_HOST "tcc-2-1e9c6-default-rtdb.firebaseio.com" 
#define FIREBASE_AUTH "iujkpJUVXc2snvRdQ0cyaopb63URqYwseC5MOlfM"

//Led que mostra estado da TRANCA (Aceso => Aberto; Apagado => Fechado)
#define LOCKED_LED 2


FirebaseData fbdo;

unsigned long sendDataPrevMillis = 0;

String path = "/usuarios/maychondouglas";

uint16_t count = 0;

void printResult(FirebaseData &data);

void setup()
{
  pinMode(LOCKED_LED, OUTPUT);
  digitalWrite(LOCKED_LED, LOW);
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  if(WiFi.status() == WL_CONNECTED){
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();
  }


  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  if (!Firebase.beginStream(fbdo, path))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream connection...");
    Serial.println("REASON: " + fbdo.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }
}

void loop(){

  //AGUARDAR 3 SEGUNDOS PARA ESPERAR A REQUISIÇÃO SER COMPLETADA
  if (millis() - sendDataPrevMillis > 3000)
  {
    sendDataPrevMillis = millis();

    if(Firebase.getBool(fbdo, path + "/locked")){
      if(fbdo.boolData() == 1){
        //apagar a LED informando que a Tranca está Fechada
        digitalWrite(LOCKED_LED, LOW);
        Serial.println("------------------------------------");
        Serial.println("Fechado!");
        Serial.println("------------------------------------");
        Serial.println();
      }else{

        //ascender a LED informando que a Tranca está Aberta
        digitalWrite(LOCKED_LED, HIGH);
        Serial.println("------------------------------------");
        Serial.println("Aberto!");
        Serial.println("------------------------------------");
        Serial.println();        
      }
    }else{
      Serial.println("------------------------------------");
      Serial.println("Something was error! :(");
      Serial.println("Description: " + fbdo.errorReason());
      Serial.println("------------------------------------");
      Serial.println();
    }
  }
}
