function rectfill (x0: number, y0: number, x1: number, y1: number, col: number) {
    screen.fillRect(x0, y0, x1 - x0 + 1, y1 - y0 + 1, col)
}

function createMaps() {
    allMaps = [
        tiles.createMap(tilemap`level1`), //intro - 1
        tiles.createMap(tilemap`level2`),  //spikes - 2
        tiles.createMap(tilemap`level3`),  //crumble,slabs - 3
        tiles.createMap(tilemap`level4`),  //gliding - 4
        tiles.createMap(tilemap`level5`),  //poppa - 5
        tiles.createMap(tilemap`level6`),  //crate - 6
        tiles.createMap(tilemap`level7`), //spittas - 7
        tiles.createMap(tilemap`level8`), //poppa tight - 8
        tiles.createMap(tilemap`level9`), //spitta skills - 9
        tiles.createMap(tilemap`level10`), //crate skills - 10
        tiles.createMap(tilemap`level11`), //fast slabs - 11
        tiles.createMap(tilemap`level12`) //end - 10
    ]
}

function createlevel (n: number) {
    blox = []
    chkpnts = []
    spikes = []
    airspikes = []
    myEffects = []
    mideffects = []
    backeffects = []
    levelnum = null
    blokmap = levels[n]
    
    tiles.loadMap(allMaps[n])
    function create(c: number, r: number, sp: number) {
        sp = sp || mget(c, r)
        let b = null
        if (sp == 1) {
            mset(c, r, 0)
            us = new player(c, r)
            b = us
        } else if (sp >= 4 && sp <= 7) {
            mset(c, r, 0)
            b = new slab(c, r, sp)
        } else if (sp == 38 || sp == 39) {
            mset(c, r, 0)
            b = new slab(c, r, sp)
        } else if (sp == 12 || sp == 44) {
            if (sp == 44) {
                sp = 12
                mset(c, r, 24)
                spikes.push({ x: c * 8, y: r * 8 })
            } else {
                mset(c, r, 0)
            }
            b = new blok(c * 8, r * 8, 8, 8, f_crate, (f_trap | f_ledge), sp)
            b.pushmask = f_crate | f_player
            b.g = grav
            b.dy = dropdamp
            b.momignore = f_trap
        } else if (sp == 16) {
            b = new puck(c, r, sp)
        } else if (sp == 56) {
            b = new poppa(c, r, sp)
        } else if (sp == 19 || sp == 20) {
            mset(c, r, 0)
            b = new spitta(c, r, sp)
        } else if (sp == 26) {
            mset(c, r, 0)
            chkpnts.push(new chkpnt(c, r))
        } else if (sp == 24) {
            spikes.push({ x: c * 8, y: r * 8 })
        } else if (sp == 28) {
            airspikes.push({ x: c * 8, y: r * 8 })
        } else if (!levelnum && sp == 63) {
            levelnum = { x: c * 8, y: r * 8 }
        }
        if (b) {
            blox.push(b)
        }
    }
    forinrect(blokmap.x, blokmap.y, blokmap.w, blokmap.h, create)
    
    let [camx, camy] = us.cam()
    cam_x = camx
    cam_y = camy
    flrsharps = new sharps(spikes, [99, 99, 100, 100, 100, 101, 101, 101, 101, 102, 102, 103, 103])
    airsharps = new sharps(airspikes, [88, 88, 88, 104, 104, 104, 104, 105, 105, 106, 106, 107, 107])
}

function mapdrawImage(from: Image, x: number, y: number, flip_x?: boolean, flip_y?: boolean) {
    if(y <= 0) {
        screen.drawTransparentImage(from, x, 0)
    } else {
        if (scene.cameraTop() <= y && y <= (scene.cameraTop() + screen.height)) {
            if (flip_x) {
                from.flipX()
            }
            if (flip_y) {
                from.flipY()
            }
            screen.drawTransparentImage(from, x, y - scene.cameraTop())
        }
    }
    
}


function mapdrawRect(x:number,y:number,w:number,h:number,c:number){
    if (scene.cameraTop() < y && y < (scene.cameraTop() + screen.height)) {
        screen.drawRect(x, y - scene.cameraTop(),w,h,c)
    }
}

function mapdrawLine(x0: number, y0: number, x1: number, y1: number, c: number) {
    if (scene.cameraTop() < y0 && y0 < (scene.cameraTop() + screen.height)) {
        screen.drawLine(x0, y0 - scene.cameraTop(), x1, y1 - scene.cameraTop(),c)
    }
}

function mapPrint(text: string, x: number, y: number, color?: number) {
    if (scene.cameraTop() < y && y < (scene.cameraTop() + screen.height)) {
        screen.print(text, x, y - scene.cameraTop(), color,image.font5)
    }
}

function mapfillCircle(cx: number, cy: number, r: number, c: number) {
    if (scene.cameraTop() < cy && cy < (scene.cameraTop() + screen.height)) {
        screen.fillCircle(cx, cy - scene.cameraTop(),r,c)
    }
}

function mapdrawCircle(cx: number, cy: number, r: number, c: number) {
    if (scene.cameraTop() < cy && cy < (scene.cameraTop() + screen.height)) {
        screen.drawCircle(cx, cy - scene.cameraTop(), r, c)
    }
}

function fget (sp: number) {
    if (sp == 1 || sp == 2) {
        return 0x1
    } else if (sp == 8 || sp == 9 || sp == 10 || sp == 11 || sp == 24 || sp == 26 || sp == 28
        || sp == 40 || sp == 41 || sp == 42 || sp == 43 ) {
        return 0x4
    } else if (sp == 4 || sp == 5 || sp == 6 || sp == 7 || sp == 33 || sp == 29 || sp == 63 || sp == 52 || sp == 53 || sp == 54
        || sp == 64 || sp == 65 || sp == 66 || sp == 67 || sp == 19 || sp == 20 || sp == 50 || sp == 49) {
        return 0x2
    } else if (sp == 13 || sp == 14 || sp == 15 || sp == 38 || sp == 39) {
        return 0x8
    } else if (sp == 12 || sp == 44) {
        return 0x10
    } else if (sp == 16 || sp == 17 || sp == 18 || sp == 56 || sp == 57 || sp == 58) {
        return 0x20
    } else if (sp == 61 || sp == 62){
        return 0x40
    }
    return 0
}
const colors = palette.defaultPalette();
function fadepal (_perc: number) {

    let kmax:number, col:number;
    let p = Math.floor(middleOfThree(0, _perc, 1) * 100)
    dpal = [0,1,1,2,1,13,6,4,4,9,3,13,1,13,14]
    for(let j = 1; j <= 15;j++) {
        col = j
        kmax = (p + (j * 1.46)) / 22
        for(let k = 1;k <= kmax;k++) {
            if (col == 0 ) {
                 col = 0
             } else {
                col = dpal[col-1]
            }
        }
        if(j == 12) {
            backcol = col
        }
        palette.setColor(j, colors.color(col))
    }
}
function contains (x0: number, y0: number, w0: number, h0: number, x: number, y: number) {
    return x >= x0 && y >= y0 && x < x0 + w0 && y < y0 + h0
}
function gameInit () {
    game.consoleOverlay.setVisible(true)
    createMaps()
    createlevel(level)
    transition = new transit(null, 30)
    transition.dir = -1
    transition.t =  30
}
function mset (c: number, r: number, snum: number) {
    if (snum == 0) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.tile`transparency8`)
    } else if (snum == 24) {
        tiles.setTileAt(tiles.getTileLocation(c, r),assets.image`myImage21`)
    } else if (snum == 25) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage22`)
    } else if (snum == 59) {
        tiles.setTileAt(tiles.getTileLocation(c, r), assets.image`myImage55`)
    }
}
function within (x0: number, w0: number, x: number) {
    return x >= x0 && x < x0 + w0
}

function mget (c: number, r: number) {
    if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile23`)) {
        return 1
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.image`myImage47`)) {
        return 2
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile4`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile11`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile10`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile8`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile19`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile22`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile16`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile12`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile15`)
        || tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile13`)){
        return 33
    }  else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile18`)) {
        return 50
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile17`)) {
        return 49
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile24`)) {
        return 16
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile25`)) {
        return 13
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile26`)) {
        return 14
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile28`)) {
        return 15
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile6`)) {
        return 29 
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile`)) {
        return 63
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile34`)) {
        return 24
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile39`)) {
        return 28
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile38`)) {
        return 26
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile40`)) {
        return 52
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile20`)) {
        return 53
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile21`)) {
        return 54
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile5`)) {
        return 4
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile44`)) {
        return 5
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile50`)) {
        return 6
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile49`)) {
        return 7
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile41`)) {
        return 8
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile35`)) {
        return 9
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile45`)) {
        return 10
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile46`)) {
        return 11
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile45`)) {
        return 93
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile46`)) {
        return 94
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile53`)) {
        return 56
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile54`)) {
        return 12
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile55`)) {
        return 61
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile56`)) {
        return 62
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile51`)) {
        return 19
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile52`)) {
        return 20
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile58`)) {
        return 38
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile57`)) {
        return 39
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile59`)) {
        return 44
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile60`)) {
        return 40
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile61`)) {
        return 41
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile62`)) {
        return 42
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(c, r), assets.tile`myTile63`)) {
        return 43
    }
    return 0
}
function shake (x: number, y: number) {
    if (Math.abs(x) > Math.abs(shkx)) {
        shkx = x
        shkxt = shkdelay + 1
    }
    if (Math.abs(y) > Math.abs(shky)) {
        shky =  y 
        shkyt = shkdelay + 1
    }
}
let i = 0
let dpal: number[] = []
let p = 0
let level:number = -1
let levels: mapif[] = []
let us: player = null
let shky: number = 0
let shkx: number = 0
let transition: transit = null
let cam_y: number = 0
let cam_x: number = 0
let backeffects: any[] = []
let mideffects: any[] = []
let myEffects: any[] = []
let airspikes: { x: number; y: number; }[] = []
let spikes: { x: number; y: number; }[] = []
let chkpnts: chkpnt[] = []
let blox: blok[] = []
interface mapif {
    x: number;
    y: number;
    w: number;
    h: number;
}
let f_player: number = (1 << 0)
let f_wall: number = (1 << 1)
let f_trap: number = (1 << 2)
let f_ledge: number = (1 << 3)
let f_crate: number = (1 << 4)
let f_puck: number = (1 << 5)
let f_stop: number = (1 << 6)
let f_outside: number = (1 << 8)
let f_trapstop = (f_trap | f_stop)
let showlevelnum: number;
let blokn: number = 0
let blokmap: mapif = { x: 0, y: 0, w: 16, h: 16 };
let dropdamp = 0.98
let grav = 0.37
let minmove = 0.1
// --power of pop - jump
let poppwr = 5.6
let levelnum: any
let flrsharps: any
let airsharps: any
levels = [
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 16 },
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 48 },
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 16 },
{ x: 0, y: 0, w: 20, h: 16 },
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 16 },
{ x: 0, y: 0, w: 20, h: 32 },
{ x: 0, y: 0, w: 20, h: 16 },
{ x: 0, y: 0, w: 16, h: 16 }
]
let allMaps: tiles.WorldMap[] = []
let backcol = 12
let frames = 12
let fadep = 1
level = 0
let shkdelay = 2
let shkxt = 2
let shkyt = 2
let exitMelody = new music.Melody('E2-600 G#2 B2 C#4 B3 A3 C#4 R a3 R e4')
let flrMelody = new music.Melody('D#2-800 C#2 E2 G#2 B2 C#4 F4')
let pushMelody = new music.Melody('C#3-800  F2')
let melody_01 = new music.Melody('~16 E4-800')
let deadMelody = new music.Melody('G3-3000 E3 C3 G#2 A2 D#1 D2 C# F1 A F# E R C#')
let melody_fly = new music.Melody('~5 C-1300 R')//not smooth
let melody_07 = new music.Melody('~1 a1-1000 a0')
let melody_08 = new music.Melody('~1 E3-1000 R B2 R G#3')
let melody_11 = new music.Melody('~1 A#2-3000 R A#1 R C#2 R F2 R C2')
let melody_12 = new music.Melody("~1 C2-3000 R F#1 R F1")
function sfx(n: number, channel?: number, offset?: number, length?: number)
{
    if (n == -1) {
        melody_fly.stop()
        //music.stopAllSounds()
    } else if (n == 0) {
        pushMelody.play()
    } else if (n == 1) {
        melody_01.play()
    } else if (n == 3) {
        //melody_fly.loop()
    } else if (n == 4) {
        flrMelody.play()
    } else if (n == 5) {
        deadMelody.play()
    } else if (n == 6) {
        exitMelody.play()
    } else if (n == 7) {
        melody_07.play()
    } else if (n == 8) {
        melody_08.play()
    } else if (n == 11) {
        melody_11.play()
    } else if (n == 12) {
        melody_12.play()
    }
}

function spr(n: number, x: number, y: number, w?: number, h?: number, flip_x?: boolean, flip_y?:boolean)
{
    if(n == 1) {
        mapdrawImage(assets.image`myImage`,x,y,flip_x,flip_y)
    } else if (n == 2) {
        mapdrawImage(assets.image`myImage47`, x, y, flip_x, flip_y)
    } else if (n >= 4 && n <= 7) {
        switch (n) {
            case 4:
                mapdrawImage(assets.image`myImage2`, x, y, flip_x, flip_y)
                break;
            case 5:
                mapdrawImage(assets.image`myImage3`, x, y, flip_x, flip_y)
                break;
            case 6:
                mapdrawImage(assets.image`myImage4`, x, y, flip_x, flip_y)
                break;
            case 7:
                mapdrawImage(assets.image`myImage5`, x, y, flip_x, flip_y)
                break;
        }
    } else if (n == 12) {
        mapdrawImage(assets.image`myImage10`, x, y, flip_x, flip_y)
    } else if (n == 16 || n == 17 || n == 18 || n == 95) {
        if (n == 16) {
            mapdrawImage(assets.image`myImage105`,x,y,flip_x,flip_y)
        } else if (n == 17) {
            mapdrawImage(assets.image`myImage14`, x, y, flip_x, flip_y)
        } else if (n == 18) {
            mapdrawImage(assets.image`myImage15`, x, y, flip_x, flip_y)
        } else if (n == 95) {
            mapdrawImage(assets.image`myImage84`, x, y, flip_x, flip_y)
        }

    } else if (n == 19) {
        mapdrawImage(assets.image`myImage17`, x, y, flip_x, flip_y)
    } else if (n == 20) {
        mapdrawImage(assets.image`myImage17`, x, y, flip_x, flip_y)
    } else if (n == 21) {
        mapdrawImage(assets.image`myImage18`, x, y, flip_x, flip_y)
    } else if (n == 22) {
        mapdrawImage(assets.image`myImage19`, x, y, flip_x, flip_y)
    } else if (n == 23) {
        mapdrawImage(assets.image`myImage20`, x, y, flip_x, flip_y)
    }  else if (n == 26) {
        mapdrawImage(assets.image`myImage23`, x, y, flip_x, flip_y)
    } else if (n == 27) {
        mapdrawImage(assets.image`myImage24`, x, y, flip_x, flip_y)
    } else if (n == 30) {
        mapdrawImage(assets.image`myImage27`, x, y, flip_x, flip_y)
    } else if (n == 38) {
        mapdrawImage(assets.image`myImage34`, x, y, flip_x, flip_y)
    } else if (n == 39) {
        mapdrawImage(assets.image`myImage35`, x, y, flip_x, flip_y)
    } else if (n == 49) {
        mapdrawImage(assets.image`myImage44`, x, y, flip_x, flip_y)
    } else if (n == 50 ) {
        mapdrawImage(assets.image`myImage45`, x, y, flip_x, flip_y)
    } else if (n == 56) {
        mapdrawImage(assets.image`myImage52`, x, y, flip_x, flip_y)
    } else if (n == 57) {
        mapdrawImage(assets.image`myImage53`, x, y, flip_x, flip_y)
    } else if (n == 58) {
        mapdrawImage(assets.image`myImage54`, x, y, flip_x, flip_y)
    } else if (n >= 64 && n <= 67) {
        switch (n) {
            case 64:
                mapdrawImage(assets.image`myImage59`, x, y, flip_x, flip_y)
                break;
            case 65:
                mapdrawImage(assets.image`myImage60`, x, y, flip_x, flip_y)
                break;
            case 66:
                mapdrawImage(assets.image`myImage61`, x, y, flip_x, flip_y)
                break;
            case 67:
                mapdrawImage(assets.image`myImage62`, x, y, flip_x, flip_y)
                break;
        }

    } else if (n >= 68 && n <= 72) {
        switch (n) {
            case 68:
                mapdrawImage(assets.image`myImage63`, x, y, flip_x, flip_y)
                break;
            case 69:
                mapdrawImage(assets.image`myImage64`, x, y, flip_x, flip_y)
                break;
            case 70:
                mapdrawImage(assets.image`myImage65`, x, y, flip_x, flip_y)
                break;
            case 71:
                mapdrawImage(assets.image`myImage66`, x, y, flip_x, flip_y)
                break;
            case 72:
                mapdrawImage(assets.image`myImage67`, x, y, flip_x, flip_y)
                break;
        }

    } else if (n >= 73 && n <= 78) {
        switch(n) {
            case 73:
                mapdrawImage(assets.image`myImage68`, x, y, flip_x, flip_y)
                break;
            case 74:
                mapdrawImage(assets.image`myImage69`, x, y, flip_x, flip_y)
                break;
            case 75:
                mapdrawImage(assets.image`myImage70`, x, y, flip_x, flip_y)
                break;
            case 76:
                mapdrawImage(assets.image`myImage71`, x, y, flip_x, flip_y)
                break;
            case 77:
                mapdrawImage(assets.image`myImage72`, x, y, flip_x, flip_y)
                break;
            case 78:
                mapdrawImage(assets.image`myImage73`, x, y, flip_x, flip_y)
                break;
        }
        
    } else if (n == 79) {
        mapdrawImage(assets.image`myImage74`, x, y, flip_x, flip_y)
    } else if (n == 80) {
        mapdrawImage(assets.image`myImage75`, x, y, flip_x, flip_y)
    } else if (n == 81) {
        mapdrawImage(assets.image`myImage76`, x, y, flip_x, flip_y)
    } else if (n == 98) {
        if(h == 1) {
            mapdrawImage(assets.image`myImage0`, x, y, flip_x, flip_y)
        } else if (h == 2) {
            mapdrawImage(assets.image`myImage77`, x, y, flip_x, flip_y)
        } else if (h == 3) {
            mapdrawImage(assets.image`myImage78`, x, y, flip_x, flip_y)
        } else if (h == 4) {
            mapdrawImage(assets.image`myImage106`, x, y, flip_x, flip_y)
        } else if (h == 5) {
            mapdrawImage(assets.image`myImage107`, x, y, flip_x, flip_y)
        } else if (h == 6) {
            mapdrawImage(assets.image`myImage108`, x, y, flip_x, flip_y)
        } else if (h == 7) {
            mapdrawImage(assets.image`myImage109`, x, y, flip_x, flip_y)
        } else {
            mapdrawImage(assets.image`myImage87`, x, y, flip_x, flip_y)
        }
    } else if (n == 84) {
        mapdrawImage(assets.image`myImage79`, x, y, flip_x, flip_y)
    } else if (n == 85) {
        mapdrawImage(assets.image`myImage80`, x, y, flip_x, flip_y)
    } else if (n == 86) {
        mapdrawImage(assets.image`myImage81`, x, y, flip_x, flip_y)
    } else if (n == 87) {
        mapdrawImage(assets.image`myImage82`, x, y, flip_x, flip_y)
    } else if (n == 88) {
        mapdrawImage(assets.image`myImage83`, x, y, flip_x, flip_y)
    } else if (n == 93) {
        mapdrawImage(assets.image`myImage11`, x, y, flip_x, flip_y)
    } else if (n == 94) {
        mapdrawImage(assets.image`myImage12`, x, y, flip_x, flip_y)
    } else if (n >= 99 && n <= 103) {
        switch (n) {
            case 99:
                mapdrawImage(assets.image`myImage88`, x, y, flip_x, flip_y)
                break;
            case 100:
                mapdrawImage(assets.image`myImage89`, x, y, flip_x, flip_y)
                break;
            case 101:
                mapdrawImage(assets.image`myImage90`, x, y, flip_x, flip_y)
                break;
            case 102:
                mapdrawImage(assets.image`myImage91`, x, y, flip_x, flip_y)
                break;
            case 103:
                mapdrawImage(assets.image`myImage92`, x, y, flip_x, flip_y)
                break;
        }
    } else if (n >= 104 && n <= 107) {
        switch (n) {
            case 104:
                mapdrawImage(assets.image`myImage93`, x, y, flip_x, flip_y)
                break;
            case 105:
                mapdrawImage(assets.image`myImage94`, x, y, flip_x, flip_y)
                break;
            case 106:
                mapdrawImage(assets.image`myImage95`, x, y, flip_x, flip_y)
                break;
            case 107:
                mapdrawImage(assets.image`myImage96`, x, y, flip_x, flip_y)
                break;
        }
    } else if(n>=108 && n <=111) {
        switch (n) {
            case 108:
                mapdrawImage(assets.image`myImage97`,x,y,flip_x,flip_y)
                break;
            case 109:
                mapdrawImage(assets.image`myImage98`, x, y, flip_x, flip_y)
                break;
            case 110:
                mapdrawImage(assets.image`myImage99`, x, y, flip_x, flip_y)
                break;
            case 111:
                mapdrawImage(assets.image`myImage100`, x, y, flip_x, flip_y)
                break;
        }
        
    }
}
function pick1(a: any, b: any): any {
    if (randint(0, 2) > 1) {
        return a
    }
    return b
}
function forinrect(x: number, y: number, w: number, h: number, method: Function): any {
    for (let c = x; c <= (x + w) - 1; c++) {
        for (let r = y; r <= (y + h) - 1; r++) {
            method(c, r)
        }
    }
}

function sgn(t:number):number
{
    return t >= 0 ? 1:-1
}
const middleOfThree = (a: number, b: number, c: number) => {
    // x is positive if a is greater than b.
    // x is negative if b is greater than a.
    let x = a - b;
    let y = b - c;
    let z = a - c;
    // Checking if b is middle (x and y both
    // are positive)
    if (x * y > 0) {
        return b;
    } else if (x * z > 0) {
        return c;
    } else {
        return a;
    }
};
class transit {
    public active: boolean
    public dir: number
    private swap: Function
    private delay: number
    public t: number

    constructor(swap: Function, delay: number) {
        this.active = true
        this.dir = 1
        this.swap = swap
        this.delay = delay
        this.t = 0
    }

    upd() {
        this.t += this.dir
        if (this.t == this.delay) {
            this.swap()
            this.dir = -1
        } else if (this.t == 0) {
            this.active = false
        }
        fadepal(1 / this.delay * this.t)
    }
}
gameInit()

game.onShade(function () {
    //for debug
    // for (let l of blox) {
    //     if (l.active) {
    //         l.drawdbg()
    //     }
    // }
    
})
let timegame = 0
let debug:any[] = []
game.onPaint(function() {
    rectfill(0, 0, 0 + 160, 0 + 4, 7)
    rectfill(0, 0 + 6, 0 + 160, 0 + 9, 7)
    rectfill(0, 0 + 12, 0 + 160, 0 + 13, 7)
    rectfill(0, 0 + 17, 0 + 160, 0 + 17, 7)
})
game.onShade(function () {
    if (transition) {
        transition.upd()
        if (!transition.active) {
            transition = null
            showlevelnum = 128
        }
    }
   
    
    scene.setBackgroundColor(backcol)
    let [x, y] = us.cam()
    let g = 0.25
    let scroll_x = (x - cam_x) * g
    let scroll_y = (y - cam_y) * g
    cam_x += scroll_x
    cam_y += scroll_y
    let cx = cam_x + shkx
    let cy = cam_y + shky

    scene.centerCameraAt(cx, cy + screen.height/2)
    //--cloud lines


    backeffects = draw_active(backeffects)
    x = blokmap.x * 8
    y = blokmap.y * 8

    for (let h of chkpnts) {
        h.draw()
    }

    //--draw the level number if present
    if (levelnum) {
        let displayLevel = level + 1
        let lvls = levels.length - 2
        let s = (displayLevel < 10 ? "0" + displayLevel : "" + displayLevel) + "/" + (lvls < 10 ? "0" + lvls : "" + lvls)
        mapPrint(s, levelnum.x + 2, levelnum.y + 2, 1)
        mapPrint(s, levelnum.x + 1, levelnum.y + 1, 4)
    }
    flrsharps.draw()
    airsharps.draw()

    //--draw a rect of ground under map for screenshake to see
    y += blokmap.h * 8
    rectfill(x, y, x + blokmap.w * 8, y + 8, 5)
    mideffects = draw_active(mideffects)
    //-- draw blox
    for (let l of blox) {
        if (l.active) {
            if (l != us) {
                l.draw()
            }
        }
    }
    if (us.active) {
        us.draw()
    }

    myEffects = draw_active(myEffects)

    //--update screen shake
    if (shkxt > 0) {
        shkxt -= 1
        if (shkxt == 0) {
            let sn = sgn(shkx)
            if (sn > 0) {
                shkx = -shkx
            } else {
                shkx = -(shkx + 1)
            }
            shkxt = shkdelay
        }
    }
    if (shkyt > 0) {
        shkyt -= 1
        if (shkyt == 0) {
            let sn2 = sgn(shky)
            if (sn2 > 0) {
                shky = -shky
            } else {
                shky = -(shky + 1)
            }
            shkyt = shkdelay
        }
    }

    //palette.reset()
    
})
function draw_active(table: any[]): any[] {
    let good2 = []
    let m = 0
    for (let n of table) {
        if (n.active) {
            n.draw()
            good2[m] = n
            m += 1
        }
    }
    return good2
}
class blok {
    public active: boolean;
    public flipx: boolean;
    public flipy: boolean;
    public pushmask: number;
    public crushmask: number;
    public momignore: number;
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public flag: number;
    public ignore: number;
    public sp: number;
    public touchx: any;
    public touchy: any;

    public vx: number;
    public vy: number;
    public dx: number;
    public dy: number;
    public mom: any;
    private kids: blok[];
    public g: number;
    private n: number;
    public anim:anim;

    constructor(x?: number, y?: number, w?: number, h?: number, flag?: number, ignore?: number, sp?: number) {
        this.active = true
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 8;
        this.h = h || 8;
        this.flag = flag || 0;
        this.ignore = ignore || 0;
        this.sp = sp || 1;
        this.vx = 0
        this.vy = 0
        this.dx = 0
        this.dy = 0
        this.touchx = null
        this.touchy = null

        this.flipx = false
        this.flipy = false
        this.pushmask = 0
        this.crushmask = 0
        this.momignore = 0
        this.mom = null
        this.kids = []
        this.g = 0
        blokn += 1
        this.n = blokn
    }

    upd() {
        if (Math.abs(this.vx) > 0.1) {
            this.movex(this.vx)
        }
        if (Math.abs(this.vy) > 0.1) {
            this.movey(this.vy)
        }
        this.vx *= this.dx
        this.vy *= this.dy

        if (Math.abs(this.g) != 0) {
            if (!this.mom) {
                this.vy += this.g
            } else {
                let m = this.mom
                if (!(m  instanceof blok) ) {
                    if (mget(Math.idiv(m.x, 8), Math.idiv(m.y , 8)) != m.sp) {
                        this.mom = null
                    }
                }
            }
        }
    }

    movex(v: number): number {
        let x1 = this.x
        let y1 = this.y
        let w1 = this.w
        let h1 = this.h
        let edge = v > 0 ? (x1 + w1) : x1;
        let obstacles:any[] = []
        if (v > 0) {
            obstacles = getobstacles(x1 + w1, y1, v, h1, this.ignore, this)
            obstacles.sort(rightwards)
        } else if(v < 0){
            obstacles = getobstacles(x1 + v, y1, Math.abs(v), h1, this.ignore, this)
            obstacles.sort(leftwards)
        }
        if (obstacles.length > 0) {
            for (let ob of obstacles) {
                let obedge = v > 0 ? ob.x : (ob.x + ob.w)
                if ((v > 0 && obedge > edge + v) || (v < 0 && obedge < edge + v)) {
                    break;
                }
                let shdmove = (edge + v) - obedge
                this.touchx = ob
                if ((ob.flag & this.pushmask) > 0 && ob instanceof blok ) {
                    let moved = ob.movex(shdmove);
                    let crush = ((ob.flag & this.crushmask) > 0)
                    if (Math.abs(moved) < Math.abs(shdmove)) {
                        if (crush) {
                            ob.death()
                        } else {
                            v -= (shdmove - moved)
                        }
                    }
                } else {
                    v -= shdmove
                }
                if (Math.abs(v) < 0.1) {
                    break;
                }
            }
        }
        this.x += v
        this.x = Math.round(this.x * 10000) / 10000;
        //have i lost a parent
        if (this.mom) {
            let t = this.mom
            if (this.x >= t.x + t.w || this.x + this.w <= t.x) {
                if (t instanceof blok ) {
                    t.delkid(this)
                } else {
                    this.mom = null
                }
            }
        }

        //move children
        if (this.kids.length > 0) {
            let kids = this.kids
            if (v > 0) {
                for (let u = this.kids.length-1; u >= 0; u += -1) {
                    kids[u].movex(v)
                }
            } else if (v < 0) {
                for (let j = 0; j < kids.length; j++) {
                    kids[j].movex(v)
                }
            }
        }
        return v
    }

    movey(v: number): number {
        let x = this.x
        let y = this.y
        let w = this.w
        let h = this.h
        let edge = v > 0 ? (y + h) : y
        let obstacles2: any[] = []
        if (v > 0) {
            obstacles2 = getobstacles(x, (y + h), w, v, this.momignore || this.ignore, this)
            obstacles2.sort(downwards)
        } else if (v < 0) {
            obstacles2 = getobstacles(x, (y + v), w, Math.abs(v), this.ignore, this)
            obstacles2.sort(upwards)
        }

        if (obstacles2.length > 0) {
            for (let ob of obstacles2) {
                let obedge = v > 0 ? ob.y : (ob.y + ob.h)
                if ((v > 0 && obedge > (edge + v)) || (v < 0 && obedge < (edge + v))) {
                    break;
                }
                let shdmove = (edge + v) - obedge
                let skip = false
                if (v > 0 && this.momignore) {
                    if ((y + h) > ob.y) {
                        skip = true
                    }
                }
                if (!skip) {
                    this.touchy = ob
                    let moved2 = 0
                    let crush2 = ((ob.flag & this.crushmask) > 0)
                    if ((ob.flag & this.pushmask) > 0 && (ob instanceof blok )) {
                        moved2 = ob.movey(shdmove)
                        if (v < 0 && v < ob.vy && ob.mom != this) {
                            this.addkid(ob)
                        }
                        if (Math.abs(moved2) < Math.abs(shdmove)) {
                            if (crush2) {
                                ob.death()
                            } else {
                                v -= (shdmove - moved2)
                            }
                        }
                    } else {
                        v -= shdmove
                    }

                    if (shdmove > 0 && !crush2) {
                        if (this.mom) {
                            this.delmom()
                        }
                        if (ob instanceof  blok) {
                            ob.addkid(this)
                        } else {
                            this.mom = ob
                            this.vy = 0
                        }
                    }
                    if (Math.abs(v) < 0.1) {
                        break;
                    }    
                }
            }
        }
        this.y += v
        this.y = Math.round(this.y * 10000) / 10000;
 
        if (this.mom) {
            if (this.y + this.h < this.mom.y) {
                this.delmom()
            }
        }

        if (v > 0.1 && this.kids.length > 0) {
            for (let b2 of this.kids) {
                if (b2.active) {
                    b2.movey(v)
                }
            }
        }
        return v
    }

    addkid(b: blok) {
        if (b.mom) {
            b.delmom()
        }
        b.mom = this
        b.vy = 0
        this.kids.push(b)
        this.kids.sort(rightwards)
    }

    delkid(b: blok) {
        b.mom = null
        this.kids.removeElement(b);
    }

    delmom() {
        if (this.mom instanceof blok) {
            this.mom.delkid(this)
        } else {
            this.mom = null
        }
    }

    divorce() {
        if (this.mom) {
            this.delmom()
        }
        for (let b3 of this.kids) {
            b3.mom = null
            b3.vy = 0
        }
        this.kids = []
    }

    jmp(p: number) {
        this.divorce()
        let s2 = -p * 0.8
        this.vy = s2
        this.dy = dropdamp
    }

    center(): [number, number] {
        return [this.x + this.w * 0.5, this.y + this.h * 0.5]
    }

    intersectsblok(a: blok): boolean {
        return !(a.x >= this.x + this.w || a.y >= this.y + this.h || this.x >= a.x + a.w || this.y >= a.y + a.h)
    }

    intersects(x: number, y: number, w: number, h: number): boolean {
        return !(x >= this.x + this.w || y >= this.y + this.h || this.x >= x + w || this.y >= y + h)
    }

    normalto(bx: number, by: number): [number, number, number] {
        let [ax, ay] = this.center()
        let vx = (bx - ax)
        let vy = (by - ay)
        let len = Math.sqrt(vx * vx + vy * vy)
        if (len > 0) return [vx / len, vy / len, len]
        return [0, 0, 0]
    }

    moveto(x: number, y: number, v: number, d: number) {
        let [tx, ty, len] = this.normalto(x, y)
        if (v > len) v = len
        this.vx = tx * v
        this.vy = ty * v
        this.dx = d
        this.dy = d
    }

    trapchk() {
        let traps = mapobjects(this.x, this.y, this.w, this.h, ~f_trap)
        let endgame = false
        if (traps.length > 0) {
            //-- found a trap
            for (let t2 of traps) {
                let c2 = Math.floor(t2.x / 8)
                let r2 = Math.floor(t2.y / 8)
                let s3 = t2.sp
                if (s3 == 24) {
                    if ((this.y + this.h > t2.y + 2) && (this.y + this.h <= t2.y + t2.h)
                        && (within(t2.x,t2.w,this.x + this.w / 2)) && (this.vy > grav * 2 || (this.y + this.h < t2.y + t2.h - 2 && this.vy > 0))) {
                        this.death(t2)
                    }
                } else if (s3 == 28) {
                    let [centerx, centery] = this.center()
                    if (contains(t2.x,t2.y,t2.w,t2.h,centerx,centery)) {
                        this.death(t2)
                    }
                }
                if (!this.active) {
                    break;
                }
            }

        }
    }

    death(src?:any) {
        this.divorce()
        this.active = false
    }
    
    drawdbg() {
        mapdrawRect(this.x, this.y, this.w, this.h, 3)
        if (this.mom) {
            let m = this.mom
            mapdrawLine(this.x + this.w / 2, this.y + this.h / 2, m.x + m.w / 2, m.y + m.h / 2, 3)
        }
        mapPrint("" + this.n, this.x, this.y  - 8, 7)  
    }

    dustx() {
        new dust((this.flipx ? this.x + this.w : this.x),
            this.y + this.h / 2 + randint(0, this.h / 2),
            2, pick1(6, 7))
    }

    dusty() {
        new dust(this.x + this.w / 2, this.y + this.h, 2, pick1(6, 7))
    }

    updanim() {
        this.anim.draw()
        if (!this.anim.active) {
            this.anim = null
        }
    }

    draw(sp?: number, offx?: number, offy?: number | boolean) {
        sp = sp || this.sp
        offx = offx || - 4
        offy = offy || - 4
        let x4 = offx + this.x + this.w * 0.5
        if (typeof offy === "number") {
            let y4 = offy + this.y + this.h * 0.5
            spr(sp, x4, y4, 1, 1, this.flipx, this.flipy)
        }
    }

  


}
function centertile(c: number, r: number, w?: number, h?: number): [number, number] {
    w = w || 0
    h = h || 0
    return [(4 + c * 8) - w * 0.5, (4 + r * 8) - h * 0.5]
}
function lookblokx(x: number, y: number, w: number, h: number, v: number, source?: blok): blok {
    for (let b4 of blox) {
        if (b4 != source && ((v > 0 && b4.intersects(x + w, y, v, h))
            || (v < 0 && b4.intersects(x + v, y, Math.abs(v), h)))) {
            return b4
        }
    }
    return null
}
function lookbloky(x: number, y: number, w: number, h: number, v: number, source: blok): blok {
    for (let b5 of blox) {
        if (b5 != source && ((v > 0 && b5.intersects(x, y + h, w, v))
            || (v < 0 && b5.intersects(x, y + v, w, Math.abs(v))))) {
            return b5
        }
    }
    return null
}
interface mapobj {
    x:number;
    y:number;
    w:number;
    h:number;
    flag:number;
    sp:number;
}

function mapobjects(x: number, y: number, w: number, h: number, ignore: number, result?: (blok | mapobj)[]): (blok | mapobj)[] {
    result = result || []
    ignore = ignore || 0
    

    let xmin = Math.floor(x / 8) 
    let ymin = Math.floor(y / 8) 
    
    let xmax = Math.floor((x + w - 0.0001) / 8)
    let ymax = Math.floor((y + h - 0.0001) / 8)

    let rxmin = blokmap.x
    let rymin = blokmap.y
    let rxmax = blokmap.x + blokmap.w - 1
    let rymax = blokmap.y + blokmap.h - 1
    for (let c3 = xmin; c3 <= xmax; c3++) {
        for (let r3 = ymin; r3 <= ymax; r3++) {
            if (c3 < rxmin || r3 < rymin || c3 > rxmax || r3 > rymax) {
                
                let ob: mapobj = { x: c3 * 8, y: r3 * 8, w: 8, h: 8, flag: f_outside, sp: 0 }
                result.push(ob)
            } else {
                let sp = mget(c3, r3)
                let f2 = fget(sp)
                
                if (f2 > 0 && (f2 & ignore) == 0) {
                    let ob2: mapobj = { x: c3 * 8, y: r3 * 8, w: 8, h: 8, flag: f2, sp: sp }
                    result.push(ob2)
                }
                
            }
        }
    }
    return result
}
function getblox(x: number, y: number, w: number, h: number, ignore: number, source: blok):blok[] {
    let result = []
    ignore = ignore || 0
    for (let a2 of blox) {
        if (a2 != source && a2.active) {
            if ((ignore & a2.flag) == 0 && a2.intersects(x, y, w, h)) {
                result.push(a2)
            }
        }
    }
    return result
}
function getobstacles(x: number, y: number, w: number, h: number, ignore: number, source: blok): mapobj[] {
    let result2: any[] = []
    ignore = ignore || 0
    mapobjects(x, y, w, h, ignore, result2)
    for (let a3 of blox) {
        if (a3 != source && a3.active) {
            if ((ignore & a3.flag) == 0 && a3.intersects(x, y, w, h)) {
                result2.push(a3)
            }
        }
    }
    return result2
}
function rightwards(a: mapobj, b: mapobj): number {
    return a.x > b.x ? 1 : 0
}
function leftwards(a: mapobj, b: mapobj): number {
    return a.x < b.x ? 1 : 0
}
function downwards(a: mapobj, b: mapobj): number {
    return a.y > b.y ? 1 : 0
}
function upwards(a: mapobj, b: mapobj): number {
    return a.y < b.y ? 1 : 0
}

class player extends blok {
    public sc: number;
    public sr: number;
    private speed: number;
    private coyote: number;
    private jmpheld: boolean;
    private jmphold: number;
    private camy: number;
    private launched: boolean;
    private exit: mapobj;
    private btndwn: boolean;
    constructor(c: number, r: number) {
        //super(c,r)
        let c1 = c * 8 + 1
        let r1 = r * 8 + 2
        super(c1, r1, 6, 6, f_player, (f_trapstop | f_ledge), 1)
        this.sc = c;
        this.sr = r;
        chkpnts.push(new chkpnt(c, r))
        this.dx = 0.4
        this.dy = dropdamp
        this.speed = 0.8
        this.g = grav
        this.pushmask = f_puck | f_crate
        this.momignore = f_trapstop
        this.coyote = 0
        this.jmpheld = false
        this.jmphold = 0
        this.camy = this.y + this.h / 2
        this.launched = false
        this.exit = null
    }

    upd() {
        if (this.exit) {
            if (this.x < this.exit.x + 10) {
                this.x += 1
            } else {
                if (!transition) {
                    transition = new transit(function () {
                        if (level < levels.length) {
                            level += 1
                            createlevel(level)
                        }
                    }, 30)
                }
            }
            return
        }

        this.trapchk()
        if (!this.active) {
            return
        }
        if (controller.left.isPressed()) {
            this.vx -= this.speed
            this.flipx = true
        }
        if (controller.right.isPressed()) {
            this.vx += this.speed
            this.flipx = false
        }
        this.dy = dropdamp
        let btndwn = controller.A.isPressed() || controller.B.isPressed()
        if (btndwn) {
            if (btndwn != this.btndwn) {
                sfx(3, 0)
            }
            if (this.mom == null && this.vy >= 0) {
                this.dy = 0.1
            }
            if (this.coyote > 0 && !this.jmpheld) {
                this.jmp(3.1)
                sfx(2)
            }
        } else {
            this.jmpheld = false
            if (btndwn != this.btndwn) {
                sfx(-1, 0)
            }
        }
        this.btndwn = btndwn

        if (this.mom) {
            
            this.coyote = 3
        } else {
            this.coyote -= 1
        }

        if (Math.abs(this.vx) > minmove) {
            let ob3 = lookblokx(this.x, this.y, this.w, this.h, this.vx)
            if (ob3) {
                if ((ob3.flag & f_crate) > 0) {
                    this.vx *= 0.67
                }
            }
        }

        if (this.coyote > 0 || this.vy > 0) {
            this.camy = this.y + this.h / 2
        }
        super.upd()
        if (this.touchx) {
            let ob4 = this.touchx
            if (this.mom) {
                if ((ob4.flag & f_puck) > 0) {
                    if (!((ob4 as puck).charge)) {
                        (ob4 as puck).bump(this.flipx, this)
                    }
                } else if (ob4.sp == 29) {
                    this.exit = ob4
                    this.y = (ob4.y + ob4.h) - this.h
                    sfx(-1, 0)
                    sfx(6)
                }
            }
            this.vx = 0
        }
        if (this.touchy && this.touchy.mom != this) {
            this.vy = 0
        }
    }

    jmp(p: number) {
        super.jmp(p)
        this.coyote = 0
        this.jmpheld = true
        if (p == poppwr) {
            new splode(this.x + this.w / 2, this.y + this.h / 2, 5, 7, myEffects, 7)
            this.launched = true
            sfx(1)
        }
    }

    cam(): [number, number] {
        let [x, y] = this.center()
        if (!this.active) {
            [x, y] = centertile(this.sc, this.sr)
        }
        x = Math.min(Math.max(x - 64, blokmap.x * 8), -screen.height + (blokmap.x + blokmap.w) * 8)
        y = Math.min(Math.max(y - 60, blokmap.y * 8), -screen.height + (blokmap.y + blokmap.h) * 8)
        return [x, y]
    }

    death(src:blok) {
        super.death()
        if(src instanceof blok) {
            if (src.crushmask && (this.flag & src.crushmask) > 0) {
                if (src.touchy == this) {
                    let c4 = this.x + this.w / 2
                    let sandwich = [src, this.touchy]
                    for (let b6 of sandwich) {
                        if (c4 < b6.x) {
                            let v2 = (b6.x - this.w) - this.x
                            let m2 = this.movex(v2)
                            if (m2 == v2 && (this.x + this.w <= src.x || this.x >= src.x + src.w)) {
                                this.active = true
                            }
                        } else if (c4 >= b6.x + b6.w) {
                            let v3 = (b6.x + b6.w) - this.x
                            let m3 = this.movex(v3)
                            if (m3 == v3 && (this.x + this.w <= src.x || this.x >= src.x + src.w)) {
                                this.active = true
                            }
                        }
                        if (this.active) {
                            break;
                        }
                    }
                }
            }
        }
        
        //create corpse
        if (!this.active) {
            this.launched = false
            new splode(this.x + this.w / 2, this.y + this.h / 2, 6, 8, myEffects, 7)
            myEffects.push(new corpse(this,this.x, this.y, 79, 0, -3))
            sfx(-1, 0)
            sfx(5)
        }
    }

    respawn() {
        this.x = this.sc * 8
        this.y = this.sr * 8
        this.active = true
        this.vy = 0
        blox.push(this)
    }

    draw(sp?: number, offx?: number, offy?: number | boolean) {
        if (this.exit) {
            super.draw(1 + ((Math.idiv(frames , 2)) % 2), -4, -4)
            let x5 = this.exit.x
            let y5 = this.exit.y
            spr(30, x5, y5)
            spr(mget(Math.idiv(x5, 8) + 1, Math.idiv(y5, 8)), x5 + 8, y5)
        } else if (controller.A.isPressed() || controller.B.isPressed()) {
            let f3 = (frames % 6) + 73
            super.draw(f3, -4, -5)
        } else {
            let f4 = (controller.left.isPressed() || controller.right.isPressed()) ? (1 + ((Math.floor(frames / 2)) % 2)) : 1
            super.draw(f4, -4, -4)
        }
        if (this.launched) {
            this.dusty()
            if (this.vy >= 0) {
                this.launched = false
            }
        }
        if (this.anim) {
            this.updanim()
        }
    }

}
class puck extends blok {
    public sc: number;
    public sr: number;
    private speed: number;
    public charge: boolean
    constructor(c: number, r: number, sp: number) {
        mset(c, r, 25)
        let c1 = c * 8 + 1
        let r1 = r * 8 + 2
        super(c1, r1, 6, 6, f_puck, (f_trapstop | f_ledge), sp);
        this.sc = c
        this.sr = r
        this.dx = 0
        this.dy = dropdamp
        this.speed = 2
        this.g = grav
        this.pushmask = f_player | f_puck
        this.momignore = f_trapstop
        this.charge = false
        this.anim = null
    }

    upd() {
        this.trapchk()
        if (!this.active) {
            return
        }
        if (this.charge) {
            if (this.flipx) {
                this.vx -= this.speed
            } else {
                this.vx += this.speed
            }
        }
        super.upd()
        if (this.charge) {
            if (this.touchx) {
                let ob5 = this.touchx
                let c5 = ob5.x + ob5.w / 2
                if ((this.flipx && c5 < this.x) || ((!this.flipx && c5 > this.x))) {
                    if (ob5 == us) {
                        this.launch(ob5)
                    } else if (ob5.sp == this.sp) {
                        this.charge = false
                        if(ob5 instanceof puck) {
                            ob5.bump(this.flipx, this)
                        }
                    } else {
                        if (ob5.sp >= 52 && ob5.sp <= 54) {
                            let x6 = ob5.x + ob5.w / 2
                            let y6 = ob5.y + ob5.h / 2
                            for (let i3 = 0; i3 < 4; i3++) {
                                myEffects.push(new debris(x6, y6, pick1(93, 94), -1 + randint(0, 2), -2 - randint(0, 2)))
                            }
                            new splode(x6, y6, 5, 7, myEffects, 7)
                            sfx(9)
                            mset(ob5.x / 8, ob5.y / 8, 0)
                        }
                        this.flipx = !this.flipx
                        sfx(7)
                    }
                }
            }
        } else {
            if (this.mom == us) {
                if (us.mom) {
                    this.divorce()
                    us.y = this.y
                    this.y = this.y + us.h
                    us.jmp(poppwr)
                }
            }
        }
    }

    bump(flipx: boolean, bumper:blok) {
        sfx(0)
        this.charge = true
        this.flipx = flipx
        bumper.anim = new anim((flipx ? this.x + this.w : this.x - 8), this.y + this.h - 8,
            [84, 84, 85, 85, 86, 86, 87, 87], 6, flipx, bumper)
    }

    death(src?: any) {
        super.death(this)
        this.charge = false
        this.vx = 0
        this.vy = 0
        new splode(this.x + this.w / 2, this.y + this.h / 2, 6, 8, myEffects, 7)
        myEffects.push(new corpse(this, this.x, this.y, 95, 0, -3))
        sfx(5)
    }

    respawn() {
        this.x = this.sc * 8
        this.y = this.sr * 8
        this.active = true
        this.vy = 0
        blox.push(this)
    }

    launch(ob: blok, flipx?: boolean) {
        flipx = flipx || this.flipx
        ob.movey(this.y - (ob.y + ob.h))
        this.movex(flipx ? -6 : 6)
        this.vx = 0
        this.charge = false
        shake(0, 2)
        ob.jmp(poppwr)
    }

    draw(sp?: number, offx?: number, offy?: number | boolean) {
        if (this.charge) {
            super.draw(this.sp + 1 + ((frames) % 2))
            this.dustx()
        } else {
            super.draw()
        }
        if (this.anim) {
            this.updanim()
        }
    }
}
class poppa extends blok {
    public sc: number;
    public sr: number;
    private speed: number;
    private charge: boolean
    constructor(c: number, r: number, sp: number) {

        mset(c, r, 25)
        let c1 = c * 8
        let r1 = r * 8 + 4
        super(c1, r1, 8, 4, f_trap, (f_trap | f_ledge), sp)

        this.sc = c
        this.sr = r

        this.dx = 0
        this.dy = dropdamp
        this.speed = 0.5
        this.g = grav
        this.pushmask = 0
        this.momignore = f_trapstop
        this.charge = false
    }

    upd() {
        this.trapchk()
        if (!this.active) {
            return
        }
        let tops = getblox(this.x - 4, this.y - 4, this.w + 8, this.h + 4, (f_trapstop | f_wall), this)
        if (this.charge) {
            if (tops.length > 0) {
                for (let b7 of tops) {
                    if (b7.y + b7.h == this.y + this.h) {
                        let c6 = b7.x + b7.w / 2
                        if (c6 > this.x && c6 < this.x + this.w) {
                            this.charge = false
                            if (b7 == us) {
                                shake(0, 2)
                            } else {
                                new splode(this.x + this.w / 2, this.y + this.h / 2, 5, 7, myEffects, 7)
                            }
                            sfx(1)
                            b7.jmp(poppwr)
                            b7.movey(-4)
                        }
                    }
                }
            }
        } else {
            if (tops.length > 0) {
                if (!this.charge) {
                    sfx(10)
                }
                this.charge = true
            } else {
                this.vx += (this.flipx ? - this.speed : this.speed)
            }
        }
        super.upd()
        if (this.touchx) {
            this.flipx = !this.flipx
        }
    }

    death(src?: any) {
        super.death(this)
        this.charge = false
        this.vx = 0
        this.vy = 0
        new splode(this.x + this.w / 2, this.y + this.h / 2, 6, 8, myEffects, 7)
        myEffects.push(new corpse(this, this.x, this.y, 127, 0, -3))
        sfx(5)
    }

    respawn() {
        this.x = this.sc * 8
        this.y = this.sr * 8
        this.active = true
        this.vy = 0
        blox.push(this)
    }

    draw(sp?: number, offx?: number, offy?: number | boolean) {
        if (this.charge) {
            super.draw(this.sp + 2)
        } else {
            super.draw(this.sp + ((Math.idiv(frames, 2)) % 2))
        }
    }

    drawdbg() {
        // rect(this.x - 4, this.y - 4, (this.x - 4) + this.w + 8, (this.y - 4) + this.h + 4, 10)
        // super.drawdbg(this)
    }
}
let spitframes = [
20,
68,
69,
70,
69,
70,
69,
70,
69,
70,
69,
70,
69,
70,
71,
72
]
let spitframetotal = spitframes.length
class spitta extends blok {


    private charge: boolean
    constructor(c: number, r: number, sp: number) {
        super(c * 8, r * 8 + 2, 8, 6, f_wall, 0, sp)
        this.pushmask = 0
        this.momignore = f_trapstop
        this.charge = false
    }

    upd() {
        let tops2 = getblox(this.x, this.y - 2, this.w, 2, (f_trapstop | f_wall), this)
        if (tops2.length > 0) {
            if (!this.charge && tops2[0].mom == this) {
                this.charge = true
                sfx(11)
                let b8 = new ball(this.x + 4, this.y + 2, (this.sp == 19 ? -2 : 2))
                blox.push(b8)
            }
        } else {
            this.charge = false
        }
    }

    draw(sp?: number, offx?: number, offy?: number | boolean) {
        if (this.charge) {
            this.flipx = false
            super.draw(this.sp + 2)
        } else {
            let sp2 = spitframes[1 + Math.floor(frames / 4) % spitframetotal]
            this.flipx = (this.sp == 19)
            super.draw(sp2, -4, -5)
        }
    }
}
class ball extends blok {
    private speed: number
    constructor(x: number, y: number, vx: number) {
        super(x + vx * 2, y, 4, 4, f_trap, (f_trapstop | f_ledge), 23)
        this.dx = 1
        this.dy = 1
        this.vx = vx
        this.speed = vx
        this.pushmask = 0
        this.momignore = f_trapstop
    }

    upd() {
        super.upd()
        if (this.touchx) {
            let ob6 = this.touchx
            for (let i4 = 0; i4 < 4; i4++) {
                myEffects.push(new debris(this.x - 2, this.y - 2, pick1(80, 81), -1 + randint(0, 2), -2 - randint(0, 2)))
            }
            new splode(this.x + this.w / 2, this.y + this.h / 2, 3, 11, myEffects, 10)
            if (ob6 instanceof puck) {
                ob6.bump(this.speed < 0, this)
                let a4 = this.anim
                a4.x = this.x + a4.x
                a4.y = this.y + a4.y
                a4.track = null
                myEffects.push(this.anim)
            } else {
                sfx(12)
            }
            super.death()
        }
    }
}
// let slabignore: number = f_trapstop | f_ledge
// let slabledgeignore = f_outside - 1
class slab extends blok {
    private sc: number
    private sr: number
    private fast: number
    private speed: number
    
    constructor(c: number, r: number, sp: number) {
        let c1 = c * 8
        let r1 = r * 8
        super(c1, r1, 8, sp >= 38 ? 2 : 8, fget(sp), (f_trapstop | f_ledge), sp)
        this.sc = c
        this.sr = r
        mset(c, r, 59)
        this.speed = 0.5
        this.fast = 1
        let push = (f_puck | (f_player | f_crate))
        this.pushmask = push
        this.crushmask = push

        let n2 = c + 1
        while (mget(n2, r) == sp) {
            mset(n2, r, 59)
            this.w += 8
            n2 += 1
        }
        n2 = r + 1
        while (mget(c, n2) == sp) {
            mset(c, n2, 59)
            this.h += 8
            n2 += 1
        }
    }

    upd() {
        let traps2 = mapobjects(this.x, this.y, 8, 8, (~f_trap))
        let endgame2 = false
        if (traps2.length) {
            let t3 = traps2[0]
            let c7 = Math.floor(t3.x / 8)
            let r4 = Math.floor(t3.y / 8)
            let s4 = t3.sp
            
            if ((s4 >= 8 && s4 <= 11) || (s4 >= 40 && s4 <= 43)) {
                let fast = 1
                if (s4 >= 40 && s4 <= 43) {
                    fast = 4
                    s4 = s4 - 32
                }
                let cx2 = this.x + 4
                let cy2 = this.y + 4
                let [tx, ty] = centertile(c7, r4)
                let nsp = s4 - 4
                if (this.sp >= 38) {
                    nsp += 32
                }
                if (Math.abs(tx - cx2) == 0 && Math.abs(ty - cy2) == 0) {
                    this.sp = nsp
                    this.fast = fast
                    this.sp = nsp
                }
            }
        }

        let sp3 = this.sp
        let speed = this.speed * this.fast
        if (sp3 == 4) {
            this.vx -= speed
        }
        if (sp3 == 5) {
            this.vx += speed
        }
        if (sp3 == 6) {
            this.vy -= speed
        }
        if (sp3 == 7) {
            this.vy += speed
        }
        if (sp3 == 38) {
            this.vy -= speed
            this.ignore = (f_trapstop | f_ledge)
        } else if (sp3 == 39) {
            this.vy += speed
            this.ignore = f_outside - 1
        }

        super.upd()
    }

    draw(x: number, y: number, big: boolean) {
        x = x || this.x
        y = y || this.y
        let sp4 = this.sp
        spr(sp4, x, y)
        if ((Math.idiv(frames , 4)) % 2 < 1) {
            if (sp4 >= 38) {
                spr(sp4 + 28, x, y - 1)
            } else {
                spr(sp4 + 60, x, y)
            }
        }
        if (!big && this.w > 8) {
            for (let xb = this.w - 8; xb >= 8; xb += -8) {
                this.draw(x + xb, y, true)
            }
        }
        if (!big && this.h > 8) {
            for (let yb = this.h - 8; yb >= 8; yb += -8) {
                this.draw(y, y + yb, true)
            }
        }
    }

}
class anim {
    public active: boolean
    public x: number
    public y: number
    public sps: number[]
    public i: number
    public t: number
    private flipx: boolean
    public track: blok

    constructor(x: number, y: number, sps: number[], t: number, flipx?: boolean, track?: blok) {
        this.active = true
        this.x = (track ? x - track.x : x)
        this.y = (track ? y - track.y : y)
        this.sps = sps
        this.i = 1
        this.t = t || 0
        this.flipx = flipx
        this.track = track
    }

    draw() {
        let sp5 = this.sps[this.i]
        if (this.track) {
            if (sp5) {
                spr(sp5, this.x + this.track.x, this.y + this.track.y, 1, 1, this.flipx)
            }
        } else {
            if (sp5) {
                spr(sp5, this.x, this.y, 1, 1, this.flipx)
            }
        }
        this.i += 1
        if (this.t > 0) {
            this.t -= 1
            if (this.t <= 0) {
                this.active = false
            }
        }
    }
}
class debris {
    public active: boolean
    public x: number
    public y: number
    private sp: number
    private vx: number
    private vy: number
    public flipx: boolean
    constructor(x: number, y: number, sp: number, vx: number, vy: number) {
        this.active = true
        this.x = x
        this.y = y
        this.sp = sp
        this.vx = vx
        this.vy = vy
        this.flipx = (randint(0, 2) > 1 ? true : false)
    }

    draw() {
        spr(this.sp, this.x, this.y, 1, 1, this.flipx)
        this.x += this.vx
        this.y += this.vy
        this.vx *= dropdamp
        this.vy *= dropdamp
        this.vy += grav
        if (this.y > cam_y + 120) {
            this.active = false
        }
    }
}
class sharps extends anim {
    private list: { x: number, y: number }[]
    private n: number
    private ob: { x: number, y: number }
    constructor(list: { x: number, y: number }[], sps: number[]) {
        super(0, 0, sps, sps.length + 30 + Math.floor(randint(0, 60)))
        this.list = list
        this.n = Math.floor(randint(0, list.length-1))
    }

    next() {
        let n3 = this.n
        let list = this.list
        if (list.length > 1) {
            do {
                n3 += Math.floor(randint(-1, list.length-1))+1
                if (n3 >= list.length) {
                    n3 = 0
                }
            } while (list[n3] == this.ob)
            this.ob = list[n3]
            this.x = list[n3].x
            this.y = list[n3].y
        }
        this.n = n3
        this.t = this.sps.length + 80 + Math.floor(randint(0, 60))
        this.active = true
        this.i = 1
    }

    draw() {
        if (this.list.length == 0) {
            return
        }
        if (this.ob) {
            super.draw()
            if (!this.active) {
                this.next()
            }
        } else {
            this.next()
        }
    }
}
class corpse extends debris {
    private body: player | puck | poppa
    private stg: number
    private v: number
    constructor(body: player | puck | poppa, x: number, y: number, sp: number, vx: number, vy: number) {
        super(x, y, sp, vx, vy)
        this.body = body
        this.stg = 0
    }

    draw() {
        if (this.stg == 2) {
            this.y -= 4
            this.v *= 1.15
            this.x += this.v
            if (this.y < scene.cameraTop()-8) {
                this.active = false
            }
            spr(108 + (frames % 4), this.x, this.y, 1, 1, this.flipx)
        } else if (this.stg == 1) {
            this.y -= 2
            let targ = this.body.sr * 8
            if (this.y > targ + 32) {
                this.y -= 2
            }
            (this.body as blok).y = this.y + 6
            if (this.y + 6 < targ) {
                this.body.respawn()
                this.stg = 2
                this.v = randint(0, 6) * 0.1 - 0.3
                sfx(8, 2)
            }
            this.body.draw()
            spr(108 + (frames % 4), this.x, this.y, 1, 1, this.flipx)
        } else {
            super.draw()
            if (!this.active) {
                this.stg = 1
                this.active = true
                this.x = this.body.sc * 8
                this.y = (cam_y + screen.height < this.body.sr * 8 ? blokmap.h * 8 : cam_y + screen.height);
                (this.body as blok).x = this.x
            }
        }
    }
}
class dust {
    private active: boolean
    private x: number
    private y: number
    private r: number
    private c: number

    constructor(x: number, y: number, r: number, c: number) {
        this.active = true
        this.x = x
        this.y = y
        this.r = r
        this.c = c
        mideffects.push(this)
    }

    draw() {
        mapfillCircle(this.x, this.y, this.r, this.c)
        this.r -= 0.2
        this.y += 0.1
        if (this.r <= 0) {
            this.active = false
        }
    }
}
class splode {
    private active: boolean
    private x: number
    private y: number
    private r: number
    private t: number
    private col: number
    private colw: number

    constructor(x: number, y: number, r: number, col: number, table: any[], colw: number) {
        this.active = true
        this.x = x || 64
        this.y = y || 64
        this.r = r || 8
        this.t = 0
        this.col = col || 7
        this.colw = colw || 7
        table = table || myEffects
        table.push(this)
    }

    draw() {
        let t4 = Math.floor(this.t * 0.5)
        let x7 = this.x
        let y7 = this.y 
        let r5 = this.r
        let col2 = this.col
        let colw = this.colw
        if (t4 == 0) {
            mapfillCircle(x7, y7, r5, colw)
            mapfillCircle(x7, y7, r5 - 1, 9)
        } else if (t4 < 2) {
            mapfillCircle(x7, y7, r5, col2)
            mapfillCircle(x7, y7, r5 - 1, colw)
        } else {
            if (t4 <= r5) {
                for (let rf = t4; rf < r5; rf++) {
                    if (rf == r5) {
                        mapdrawCircle(x7, y7, rf, col2)
                    } else {
                        mapdrawCircle(x7, y7, rf, colw)
                    }
                }
            } else {
                this.active = false
            }
        }
        this.t += 1
    }
}
class chkpnt {
    private c: number
    private r: number
    public on: boolean
    private y: number
    constructor(c: number, r: number) {
        this.c = c
        this.r = r
        this.on = false
        this.y = r * 8
    }

    upd() {
        if (!this.on) {
            if (us.active) {
                let [x, y] = us.center()
                if (Math.floor(x / 8) == this.c && Math.floor(y / 8) == this.r) {
                    this.on = true
                    us.sc = this.c
                    us.sr = this.r
                    sfx(4, 2)
                    for (let c8 of chkpnts) {
                        if (c8 != this) {
                            c8.on = false
                        }
                    }
                }
            }
            if (this.y < this.r * 8) {
                this.y += 1
            }
        } else {
            if (this.y > (this.r - 1) * 8) {
                this.y -= 1
            }
        }
    }

    draw() {
        let x8 = this.c * 8
        let y8 = this.y
        let h3 = (this.r + 1) * 8 - this.y
        if (h3 > 8) {
            spr(98, x8, y8 + 8, 1, h3 - 8)
            h3 = 8
        }
        if (this.on) {
            spr(27, x8, y8, 1, h3 / 8)
        } else {
            spr(26, x8, y8, 1, h3 / 8)
        }
    }
}

game.onUpdateInterval(30, function () {
    
    let good: blok[] = []
    if (transition) {
        return
    }
    for (let a of blox) {
        a.touchx = null
        a.touchy = null
    }
    if (us.active) {
        us.upd()
    }
    for (let d of chkpnts) {
        d.upd()
    }
    for (let e of blox) {
        if (e != us && e.active) {
            e.upd()
        }
    }
    let j = 0
    for (let f of blox) {
        if (f.active) {
            good[j] = f
            j += 1
        }
    }
    blox = good
    frames += 1
})

