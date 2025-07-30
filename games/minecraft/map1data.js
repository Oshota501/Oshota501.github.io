            draw("allmap",[{
                type : "st_node" ,
                name : "" ,
                pos : [470,400] ,
                id : 0 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [600,400] ,
                id : 4 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [0,400] ,
                id : 5 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [350,400] ,
                id : 1 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [200,400] ,
                id : 2 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [50,400] ,
                id : 3 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [230,380] ,
                id : 10 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [230,320] ,
                id : 11 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [250,320] ,
                id : 12 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [300,320] ,
                id : 13 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [450,320] ,
                id : 14 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [600,320] ,
                id : 15 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [410,150] ,
                id : 100 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [340,150] ,
                id : 101 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [270,150] ,
                id : 102 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [210,150] ,
                id : 103 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [210,190] ,
                id : 104 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [210,260] ,
                id : 105 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [210,320] ,
                id : 106 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [210,380] ,
                id : 107 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [210,440] ,
                id : 108 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "airport" ,
                pos : [210,500] ,
                id : 109 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [100,100] ,
                id : 200 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [100,180] ,
                id : 201 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [100,260] ,
                id : 202 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [100,320] ,
                id : 203 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [160,380] ,
                id : 204 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [280,450] ,
                id : 206 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [350,450] ,
                id : 207 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [380,480] ,
                id : 208 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [380,500] ,
                id : 209 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [380,580] ,
                id : 210 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [30,260] ,
                id : 300 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [280,260] ,
                id : 301 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [340,260] ,
                id : 302 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [430,260] ,
                id : 303 ,
                color : "white"
            },{
                type : "nm_node" ,
                name : "" ,
                pos : [450,280] ,
                id : 304 ,
                color : "white"
            },{
                type : "st_node" ,
                name : "" ,
                pos : [450,420] ,
                id : 305 ,
                color : "white"
            },{
                type : "connect" ,
                name : "subway1" ,
                id_to_id : [100,101,102,103,104,105,106,107,108,109] ,
                color : "yellow" ,
            },{
                type : "connect" ,
                name : "subway2" ,
                id_to_id : [200,201,202,203,204,107,206,207,208,209,210] ,
                color : "yellow" ,
            },{
                type : "connect" ,
                name : "subway3" ,
                id_to_id : [300,202,105,301,302,303,304,305] ,
                color : "yellow" ,
            },{
                type : "connect" ,
                name : "Line1" ,
                id_to_id : [4,0,1,2,3,5] ,
                color : "blue" ,
            },{
                type : "connect" ,
                name : "Line2" ,
                id_to_id : [10,11,12,13,14,15] ,
                color : "red" ,
            }],"info1")