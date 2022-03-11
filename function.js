function tiledToArray(json){
    return new Promise((resolve, reject)=>{
        let tilesetIndex = 0
        let tileset = []
        let tab = []
        let tileLength = 0
        function asyncLoadImg(imageObj, src){
            return new Promise((resolve, reject)=>{
                imageObj.onload = ()=>{ 
                    resolve(imageObj)
                }
                imageObj.onerror = ()=>{
                    reject()
                }
                imageObj.src = src
            })
        }
        function getTileSet(_image, tiles, id){
            return new Promise((resolve1, reject1)=>{
                let localId = 0
                let secondCanvas = $(`<canvas width="${json.tilewidth}" height="${json.tilewidth}" id="_temporaryCanvas"></canvas>`)
                const secondCtx = secondCanvas[0].getContext('2d')
                const _imageObj = new Image()
                _imageObj.onload = function () {
                    let _lengthWidth = _imageObj.width/json.tilewidth
                    let _lengthHeight = _imageObj.height/json.tilewidth
            
                    if(_imageObj.width < json.tilewidth){
                        _lengthWidth = 1
                    }
                    if(_imageObj.height < json.tilewidth){
                        _lengthHeight = 1
                    }
                    _lengthWidth = _lengthWidth - 1
                    _lengthHeight = _lengthHeight - 1
                    const arr = []
                    let imgCount = 0
                    for(let p = 0; p < _lengthHeight; p++){
                        arr.push([])
                        const _index = arr.length - 1
                        for(let n = 0; n < _lengthWidth; n++){
                            secondCtx.clearRect(0, 0, json.tilewidth, json.tilewidth)
                            secondCtx.drawImage(_imageObj, -(n*json.tilewidth), -(p*json.tilewidth))
                            const dataURL = secondCanvas[0].toDataURL()
                            tilesetIndex++
                            localId++
                            let properties = {}
                            let animation = []
                            if(typeof(tiles) != "undefined"){
                                for(let y = 0; y < tiles.length; y++){
                                    if(typeof(tiles[y].properties) != "undefined" && tiles[y].id == localId-1){
                                        for(let t = 0; t < tiles[y].properties.length; t++){
                                            properties[`${tiles[y].properties[t].name}`] = {value: tiles[y].properties[t].value, type: tiles[y].properties[t].type}
                                        }
                                    }
                                    if(typeof(tiles[y].animation) != "undefined" && tiles[y].id == localId-1){
                                        for(let t = 0; t < tiles[y].animation.length; t++){
                                            animation.push({duration: tiles[y].animation[t].duration, localid: tiles[y].animation[t].tileid})
                                        }
                                    }
                                }
                            }
                            arr[_index].push({image: dataURL, id: tilesetIndex, properties: properties, animation: animation})
                            imgCount++
                            if(imgCount >= _lengthHeight*_lengthWidth){
                                resolve1(arr)
                            }
                        }
                    }
                }
                _imageObj.src = _image
            })
        }
        function findIndex(id){
            let _tIndex = {id1: -1, id2: -1, id3: -1}
            for(let p = 0; p < tileset.length; p++){
                for(let o = 0; o < tileset[p].length; o++){
                    for(let u = 0; u < tileset[p][o].length; u++){
                        if(tileset[p][o][u].id == id){
                            _tIndex = {id1: p, id2: o, id3: u}
                        }
                    }
                }   
            }
            return _tIndex
        }
        function findLocalIndex(__id, id){
            let _tIndex = {id1: -1, id2: -1, id3: -1}
            let plus = 0
            for(let o = 0; o < tileset[__id].length; o++){
                for(let u = 0; u < tileset[__id][o].length; u++){
                    if(plus == id){
                        _tIndex = {id1: __id, id2: o, id3: u}
                    }
                    plus++
                }
            }   
            return _tIndex
        }
        (async ()=>{
            for(let i = 0; i < json.tilesets.length; i++){
                const array = await getTileSet(json.tilesets[i].image, json.tilesets[i].tiles, i)
                tileLength++
                tileset.push(array)
                if(tileLength >= json.tilesets.length){
                    for(let i = 0; i < tileset.length; i++){
                        for(let n = 0; n < tileset[i].length; n++){
                            for(let p = 0; p < tileset[i][n].length; p++){
                                let animTab = {image: "", duration: [], frames: tileset[i][n][p].animation.length}
                                let _canvas = $(`<canvas width="${json.tilewidth*tileset[i][n][p].animation.length}" height="${json.tilewidth}" id="_temporaryCanvas"></canvas>`)
                                const _ctx = _canvas[0].getContext('2d')
                                let _imgCount = 0
                                for(let g = 0; g < tileset[i][n][p].animation.length; g++){
                                    animTab.duration.push(tileset[i][n][p].animation[g].duration)
                                    const tIndex = findLocalIndex(i, tileset[i][n][p].animation[g].localid)
                                    delete tileset[i][n][p].animation[g].localid
                                    const __imageObj = new Image()
                                    const newImageObj = await asyncLoadImg(__imageObj, tileset[tIndex.id1][tIndex.id2][tIndex.id3].image)
                                    _imgCount++
                                    _ctx.drawImage(newImageObj, json.tilewidth*(_imgCount-1), 0)
                                    if(_imgCount >= tileset[i][n][p].animation.length){
                                        const _dataURL = _canvas[0].toDataURL()
                                        animTab.image = _dataURL
                                        tileset[i][n][p].animation = animTab
                                    }
                                }
                            }
                        }
                    }
                }
                
            }
            for(let i = 0; i < json.layers.length; i++){
                let _x = 1
                let _y = 1
                tab.push({name: json.layers[i].name, data: [], properties: {}})
                if(typeof(json.layers[i].properties) != "undefined"){
                    for(let n = 0; n < json.layers[i].properties.length; n++){
                        tab[tab.length-1].properties[`${json.layers[i].properties[n].name}`] = {type: json.layers[i].properties[n].type, value: json.layers[i].properties[n].value}
                    }
                }
                for(let n = 0; n < json.layers[i].data.length; n++){
                    const tIndex = findIndex(json.layers[i].data[n])
                    if(tIndex.id1 != -1 || tIndex.id2 != -1 || tIndex.id3 != -1){
                        tab[tab.length-1].data.push({image: tileset[tIndex.id1][tIndex.id2][tIndex.id3].image, x: _x*json.tilewidth, y: _y*json.tilewidth, properties: tileset[tIndex.id1][tIndex.id2][tIndex.id3].properties, animations: tileset[tIndex.id1][tIndex.id2][tIndex.id3].animation})
                    }
                    _x = _x + 1
                    if(_x > json.width){
                        _x = 1
                        _y = _y + 1
                    }
                }
            }
            resolve(tab)
        })()
    })
}
