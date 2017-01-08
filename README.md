# SimpleArmory-ToyBox

http://simplearmory.com/ is a great site for tracking progress with achievements and collections in World of Warcraft but as the wow api doesn't track toys they aren't logged on the site. This extension adds toy page and allows you to manually check off the toys you have collected and show ones you still need.

Download from the <a href="https://chrome.google.com/webstore/detail/simple-armory-toy-box/cipjopjhpjmiikddfneebahneledggjl"> Chrome Store </a>

--- 
Toy Data
Feel free to use <a href="https://raw.githubusercontent.com/MrLuxan/SimpleArmory-ToyBox/master/ToyData.json">ToyData.json</a> in your projects as it was a pain to collect all the data.

Format
```
{
	"lastUpdate" : "Date json file last updated",
	"wowVersion" : "Wow patch number",
	"toys" : [
		   		["WowHead ID","WowHead image ID","Name"],
		   		["WowHead ID","WowHead image ID","Name"],
		   		ect...
		   ]
}
```
