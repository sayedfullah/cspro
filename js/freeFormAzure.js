(()=>
    {  
        const { warn, log } = console;
        const hostUrl = "https://www.oroafrica.uat2.dev01.cslweb.uk";
        const blobUrl = "https://oroblob.blob.core.windows.net/cspro"
        var doc, svgString;
        const parser = new DOMParser();
        const version = "1.0.0";
        const canvasConfig = {backgroundColor:"#fff",width:"300",height:"300",objectCaching:false,hoverCursor:"pointer",enableRetinaScaling:true};
        const canvas = new fabric.Canvas("canvas",canvasConfig);
        var obj, shapeGroup;
        //-----------------------------------------------
        var shapes
        ,shapeIndexSize = 0
        ,shapeIndex = 0
        ,cam,
        imgIndex=0,
        imgTypes = [`${blobUrl}/images/HRT-AG.png`,`${blobUrl}/images/HRT-9Y.png`,`${blobUrl}/images/HRT-9R.png`],
        
        imgObject,
        userText;
        //-----------------------------------------------
        var alignCount = 0
        ,fontColCount = 0;
        
        let init =()=>
        {
            log("Requesting SVG from server! ", version);
            // fetch(`/images/prism/svg/sketch.txt`,{ mode: 'no-cors' })
            // fetch(`/images/prism/svg/sketch.txt`,{ mode: 'no-cors' })
            const productElement = document.querySelector(".productId");
            const _sourceSVG = (productElement !== null) ? productElement : "HRT";
            fetch(`${blobUrl}/svg/${_sourceSVG}.svg`)
            .then(resp=> resp.text())
            .then(data=> 
            {
                doc = parser.parseFromString(data,"image/svg+xml");
                shapes = doc.getElementsByTagName("path");
                shapeIndexSize = shapes.length;
                cam = doc.getElementsByTagName("cam")[0];
    
                canvas.remove(obj);
                let impi = shapes[shapeIndex];
                let svg = createElement();
                //add svg children to new svg
                svg.appendChild(impi);

                loadImageFromURL(imgTypes[imgIndex]);

                svgString = new XMLSerializer().serializeToString(svg);

                shapeGroup = fabric.loadSVGFromString(svgString,function(objects, options) 
                {
                  obj = fabric.util.groupSVGElements(objects, options);
                  obj.set({selectable:false,objectCache:false});
                  canvas.add(obj).renderAll();
                  obj.moveTo(0);
                  obj.center();
                  canvas.sendToBack(obj);
                });
                
                scaleCanvasUp();
            })
            .catch(er=>
                {warn(er);});
        };

        const addText=(_fontColCount)=>
        {
            fontColCount = (_fontColCount) ? _fontColCount : fontColCount;
            let props = 
            {
                fill:"#000"
                ,originX:"center"
                ,originY:"center"
                ,left:225
                ,objectCaching:false
                ,textAlign:"center"
                ,top:225
                ,fontSize:fontChanger(fontColCount).fontSize
                ,padding:50
                ,fontFamily:fontChanger(fontColCount).font
            };
            userText = new fabric.IText("Click to edit",props);
            
            canvas.add(userText);
            userText.bringToFront();
            // canvas.moveTo(userText, 2);
            canvas.renderAll();
        };
    
      
        const actionButtons=()=>
        {
            let g = $(".canvasBtn").toArray();
            let h = $(".fontBtn").toArray();
            let j = $(".birthBtn").toArray();

            $(g[0]).click(()=> selectAg());
            $(g[1]).click(()=>  select9y());
            $(g[2]).click(()=> select9r());

            h.map((el,i)=> $(el).click(()=> activeFontSwap(i)));
            j.map((el,i)=> $(el).click(()=> loadBirthFromURL(el.id)));

        };
           
        const activeFontSwap = (num)=>
        {
            let s = (canvas.getActiveObject()) ? canvas.getActiveObject() : addText(num);
            s.set({fontFamily:fontChanger(num).font,fontSize:fontChanger(num).fontSize});
            canvas.discardActiveObject().renderAll();
            canvas.setActiveObject(s);
        }

        const config=()=>
        {
            //basic settings
            fabric.Object.prototype.customiseCornerIcons({
                    settings: {
                            borderColor: '#efefef',
                            cornerSize: 25,
                            cornerShape: 'circle',
                            cornerBackgroundColor: '#efefef',//rgba(150,150,150,0.6)
                            cornerPadding:7
                    }
                    ,tl:{icon: `${blobUrl}/ico/delete.svg`,cornerColor:"red"}
                    ,tr:{icon: `${blobUrl}/ico/scale.svg`}
                    ,ml:{}
                    ,mr:{}
                    ,mt:{}
                    ,mb:{icon: `${blobUrl}/ico/align.svg`}
                    ,bl:{}
                    // ,bl:{icon: `${blobUrl}/ico/palette.svg`}
                    ,br:{icon:`${blobUrl}/ico/font.svg`}
                    ,mtr:{icon: `${blobUrl}/ico/rotate.svg`}
            });
    
            fabric.Canvas.prototype.customiseControls({
                tl: {
                    cursor:"pointer"
                    ,action: 'remove'
                },
                tr: {
                    action: 'scale'
                },
                bl: {
                    cursor: 'pointer'
                    // ,action: ()=>
                    // {
                    //     let s = canvas.getActiveObject();
                    //     fontColCount = (fontColCount > 1) ? 0 : fontColCount;
                    //     s.set({fill:textColour(fontColCount)});
                    //     fontColCount +=1;
                    //     canvas.discardActiveObject().renderAll();
                    //     canvas.setActiveObject(s);
                    // }
                },
                br: {
                    cursor: 'pointer'  
                    ,action: ()=>{
                        fontColCount = (fontColCount > 4) ? 0 : fontColCount;
                        let s = canvas.getActiveObject();
                        fontColCount++;
                        s.set({fontFamily:fontChanger(fontColCount).font,fontSize:fontChanger(fontColCount).fontSize});
                        // fontColCount++;
                        canvas.discardActiveObject().renderAll();
                        canvas.setActiveObject(s);
                    }
                },
                mb: {
                    cursor: 'pointer'
                    ,action: ()=>{
                        let s = canvas.getActiveObject();
                        alignCount = (alignCount > 2) ? 0 : alignCount;
                        s.set({textAlign:textAlignment(alignCount)});
                        alignCount++;
                        canvas.discardActiveObject().renderAll();
                        canvas.setActiveObject(s);
                    }
                },
                mr: {
                    cursor: 'pointer'
                },
                mt: {
                    action: 'moveUp'
                    ,cursor: 'pointer'
                },
                // only if hasRotatingPoint is not set to false
                mtr: {
                    action: 'rotate',
                    cursor: 'default'
                }
            }
            ,()=>{canvas.renderAll();});
        };
        
        //------------------------HELPER FUNCTIONS--------------------------------->
        const scaleCanvasUp=()=>
        {
            canvas.setWidth(450);
            canvas.setHeight(450);
            canvas.zoomToPoint(new fabric.Point(225, 225), 3);
        };
        
        const scaleCanvasDown=()=>
        {
            //optional method
            canvas.setWidth(300);
            canvas.setHeight(300);
        };
        
        const zoomCanvas=()=>
        {
            canvas.on('mouse:wheel', (opt)=> {
            var delta = opt.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 5) zoom = 5;
            if (zoom < 1) zoom = 1;
            canvas.zoomToPoint(new fabric.Point(canvas.width/2, canvas.height/2), zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
            });
            
        };
        const textAlignment=(a)=>
        {
            return ["left","center","right"][a];
        };
        
        const textColour=(a)=>
        {
            return ["#f00","#0f0","#646464"][a];
        };
        
        let createElement=()=>
        {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width",300);
            svg.setAttribute("height",300);
            return svg;
        };
        

        const loadImageFromURL = (imageUrl) => {
            fabric.Image.fromURL(imageUrl, function(img) {
                img.scaleToWidth(200);
                img.set({
                    left: 125,
                    top: 116,
                    angle: 0,
                    selectable: true
                });
        
                // Remove previous image if it exists
                if (imgObject) {
                    canvas.remove(imgObject);
                }
        
                // Add the new image to the canvas
                img.selectable = false;
                  
                canvas.add(img);
                canvas.moveTo(img, 1);
                canvas.renderAll();
                objectExit(img);
                imgObject = img; // Keep reference to the current image
                
            });
        };

        const loadBirthFromURL = (imageUrl) => {
            let birthTypes = ["DIAMOND","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
                            .map((n)=>`${blobUrl}/accents/A${n}.png`);
            let _birthStone = birthTypes.find(url => url.includes(imageUrl));
            
            const rndLeft = Math.floor(Math.random() * 21);
           
            fabric.Image.fromURL(_birthStone, function(img) {
                img.scaleToWidth(8.6);
                img.set({
                    left: 225,
                    top: 225.2,
                    angle: 0,
                    selectable: true,
                    lockScalingX: true,  
                    lockScalingY: true,
                    lockScaling: true 
                });

                    const circle = new fabric.Circle({
                    radius: 3.9, 
                    fill: 'rgba(0,0,255,01)', 
                    stroke: 'rgba(0,0,0,0.3)', 
                    strokeWidth: 0,
                    left: 225.3, 
                    top: 225.5, 
                    selectable: false
                });
        
                // Create a group with the image and circle
                // const group = new fabric.Group([circle,img], {
                //     left: 225 + rndLeft,
                //     top: 225,
                //     selectable: true
                // });

                // group.set({
                //     borderColor: '#efefef',
                //     cornerColor: 'green',
                //     cornerSize: 20,
                //     transparentCorners: false
                // });

                // More granular control over which handles are visible
                img.setControlsVisibility({
                    mt: false, 
                    mb: false, 
                    ml: false, 
                    mr: false, 
                    bl: false, 
                    br: false, 
                    tl: true,
                    tr: false, 
                    mtr: true  
                });

                // Add the new image to the canvas
                canvas.add(img); 
                // canvas.add(circle); 
                canvas.bringToFront();
                canvas.renderAll();
                // objectExit(group);

            });
        };
        
        const getCanvas=()=>
        {
            scaleCanvasDown();
            let result = canvas.toSVG();
            scaleCanvasUp();
            
            return result;
        };
        
        const svgDown =(docx)=>
        {
            let shapex = docx.getElementsByTagName("svg")[0];
            shapex.removeAttribute("viewBox"); 
            shapex.setAttribute("width","300");
            shapex.setAttribute("height","300");
            shapex.setAttribute("xmlns:mingh","http://www.minghworld.com");
            
            shapex.appendChild(cam);
           
            return new XMLSerializer().serializeToString(docx);
        };
        
        const downloadImage = () => {
            $(document).on("click", "#_share", () => {
                canvas.discardActiveObject();
                canvas.renderAll();
        
                let dim = 2000; // Image resolution
                let tmpCanvas = document.createElement("canvas");
                tmpCanvas.width = dim;
                tmpCanvas.height = dim;
                let ctx = tmpCanvas.getContext("2d");
        
                let svgData = canvas.toSVG();
                let img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, dim, dim);
        
                    // Now trigger the download
                    let download = document.createElement("a");
                    download.href = tmpCanvas.toDataURL("image/png", 1.0);
                    download.download = document.title + ".png";
                    document.body.appendChild(download);
                    download.click();
                    document.body.removeChild(download);
                };
        
                // Encode SVG to avoid parsing issues
                img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
            });
        };
        
        const browseFile=()=>
        {
            //filters
            var filter = new fabric.Image.filters.RemoveWhite({threshold: 40,distance: 140});
            var bw = new fabric.Image.filters.Grayscale();
            var sharp = new fabric.Image.filters.Convolute({matrix:[0,-1,0,-1,5,-1,0,-1,0]});
            
            $(document).on("change","#_imageFile",()=>
            {
                let file = $("#_imageFile").prop("files")[0];
                
                //file size validation
                $("#_url").text(file.size/1000 +"KB" +" - "+file.name);
                if(file.size/1000 > 1000 ) {alert("file is too large, max 1mb");$("#_imageFile").val("");return;};
                
                let reader = new FileReader();
                reader.onload = function (f) 
                {
                    var data = f.target.result;  
                    fabric.Image.fromURL(data, function (img) 
                    {
                        let imSrc = 100;
                        let asp = (img.height/img.width);
                        let mw=img.width,mh=img.height;
    
                        if(img.width > imSrc || img.height > imSrc)
                        { 
                            mw = imSrc;
                            mh = mw * asp;
                        }
                        
                        img.set({left: 200, top: 200, angle: 0,opacity:1.0,width:mw,height:mh});
                        img.filters.push(filter,bw);
                        img.applyFilters();
                        canvas.add(img).renderAll();
                        img.center();
                        canvas.setActiveObject(img);
                        canvas.renderAll();
                    });
                 };
                    reader.readAsDataURL(file);
    
            });
        };
        
        const fontChanger=(a)=> 
        {
            return [
                {font:"z_corsiva",fontSize:8},
                {font:"z_boli",fontSize:8},
                {font:"z_swan",fontSize:18},
                {font:"z_chaparrals",fontSize:8},
                {font:"z_english",fontSize:9}][a];
        };
        
        const selectAg=()=>
        {
            imgIndex = 0;
            loadImageFromURL(imgTypes[0]);
        };
        const select9y=()=>
        {
            imgIndex = 1;
            loadImageFromURL(imgTypes[1]);
        };

        const select9r=()=>
        {
            imgIndex = 2;
            loadImageFromURL(imgTypes[2]);
        };

        const objectExit = (obj) => {
            obj.on('mouseout', function(event) {
                if (canvas.getActiveObject() === obj) {
                    canvas.discardActiveObject();
                    canvas.renderAll();
                }
            });
        }
        //------------------------END HELPER FUNCTIONS----------------------------->
        const serialize=()=>
        {
            $(document).on("click","#_order",()=> 
            { 
                log("serialize: ", getCanvas(doc));
                const x = parser.parseFromString(getCanvas(doc),"image/svg+xml");
                const svgExport = svgDown(x);
                const blob = new Blob([svgExport], { type: "image/svg+xml" });
                // Create an object URL
                const url = URL.createObjectURL(blob);
                
                // Create a temporary anchor element
                const a = document.createElement("a");
                a.href = url;
                a.download = "sampleSvg.svg";
                
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Revoke the object URL
                URL.revokeObjectURL(url);
            });
        };
        
        const addHrtSymbol=()=>
        {
            $(document).on("click","#_heart",()=> 
            { 
                let props = 
                {
                    fill:"#00f"
                    ,originX:"center"
                    ,originY:"center"
                    ,left:225
                    ,objectCaching:false
                    ,textAlign:"center"
                    ,top:180
                    ,fontSize:10
                    ,padding:50
                    ,fontFamily:"z_corsiva"
                };
                var s = new fabric.IText("♥",props);
                //s.enableEditing(false);
                canvas.add(s);
                canvas.renderAll();
            });
        };
      
        const render=(()=>
        {
            init();
            actionButtons();
            zoomCanvas();
            config();
            serialize();
            downloadImage();
            browseFile();
            addHrtSymbol();
        })();
        
    })();