[![alt text](http://i.imgur.com/Y6x2Sks.png "NGC-7331")](http://smauwie.github.io/NLT-spel)
Door Koen van Remundt, Jonas Stappers en Hunter van Geffen

![alt text](http://i.imgur.com/qOjqXot.png "Alpha")
#####Concept alpha
![alt text](http://i.imgur.com/4dqY0pG.png "Beta")
#####Concept beta

##Pseudocode:

####Object Speler:

Input | Output
--- | ---
toets “<--” | draai met een bepaalde hoeksnelheid naar links
toets “-->” | draai met een bepaalde hoeksnelheid naar rechts
toets “^” | bepaal in welke richting de player gedraait is en versnel in die richting
toets "x" | bepaal in welke richting de player gedraait is en vuur een bullet in die richting
collide hoek van inval | collide hoek van uitval en doe schade aan player (en enemy)
kogel raak | schade aan ontvanger of als het een astreroid is, kill bullet

####Object Enemy:

Input | Output
--- | ---
player komt dicht bij enemy | enemy draait naar player toe en versnelt in die richting
player komt dicht bij enemy | enemy schiet bullets in de richting van player
player beweegt weg van enemy | enemy blijft in zijn richting zweven totdat hij weer player tegenkomt

####Object shield:

Input | Output
--- | ---
player wordt geraakt | een balkje verdwijnt
een bepaalde tijd gaat voorbij | een balkje komt erbij

##Planning:

####Week1:
Planning af!
Pseudocode af!

####Week2:
#####alpha:
- ruwe versie spel
- makkelijke map 
- placeholder art
- schip kan bewegen, schieten en schade krijgen 
- enemy’s kunnen schaden krijgen, bewegen en schieten

	
####Week3:
#####beta:
- achtergrond
- makkelijke artwork
- het idee van de map
- valuta.
- verschillende wapens
- schild
- credits aan het eind

####Week4:
Spel af!

####Week 5:
extra updates
