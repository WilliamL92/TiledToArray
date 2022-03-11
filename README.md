# TiledToArray
A function to convert a JSON Tiled file to a readable array, easy to use in js canvas using Jquery

# How to use it ?

1) In Tiled, go to File -> Export as -> JSON
2) Import the JSON file into your app
3) Clone or copy the function.js into your app

### Don't forget to import the Jquery library before init the TiledToArray function

### Now in your js code you can use the function like the example below

```const json = "./media/myJsonFile.json" //The link to your JSON file from Tiled
const reader = new FileReader()
reader.onload = ()=>{
  tiledToArray(JSON.parse(reader.result)).then((array)=>{
    console.log(array)
    
    // EXPECTING OUTPUT
    
    // [{
    // name: "layer1",
    // properties: {customClass: {type: "string", value: "mainLayer"}},
    // data: [{
    //    animations: {
    //      duration: [200, 200, 200],
    //      frames: 3,
    //      image: "Base64 image..."
    //    },
    //    properties: {customClassTile: {type: "string", value: "myClass"}},
    //    image: "default base64 image...",
    //    x: 55,
    //    Y: 60
    //  }],
    // }]
  })
}
reader.readAsText(json)  
```
