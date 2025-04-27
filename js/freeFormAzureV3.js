(()=>
    {  
        const { warn, log } = console;
        const hostUrl = "https://www.oroafrica.uat2.dev01.cslweb.uk";

        const parser = new DOMParser();
        const version = "1.0.0";
        const canvasConfig = {backgroundColor:"#fff",width:"300",height:"300",objectCaching:false,hoverCursor:"pointer",enableRetinaScaling:true};
        const canvas = new fabric.Canvas("canvas",canvasConfig);

        var 
        blobUrl = "https://oroblob.blob.core.windows.net/cspro"
        ,canvasPng
        ,shapes
        ,doc
        ,svgString
        ,shapeIndexSize = 0
        ,shapeIndex = 0
        ,cam,
        imgIndex = 0
        ,imgObject
        ,userText
        ,obj
        ,shapeGroup
        ,alignCount = 0
        ,fontColCount = 0
        ,isMobile = false
        ,accentCount = 0 // use trackAccentCount() if needed
        ,maxAccent = 2
        ,imgTypes = [`${blobUrl}/images/HRT-AG.png`,`${blobUrl}/images/HRT-9Y.png`,`${blobUrl}/images/HRT-9R.png`,`${blobUrl}/images/HRT-AG.png`]   
        ,mobileSize = {"birthTop": 150,"birthLeft":150,"textTop":150,"textLeft":150,"productTop":40,"productLeft":50,"mobileWidth":150}   
        ,desktopSize ={"birthTop": 225.2,"birthLeft":225,"textTop":225,"textLeft":225,"productTop":116,"productLeft":125,"desktopWidth":225}
        ,birthTypes = ["DIAMOND","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].map((n)=>`${blobUrl}/accents/A${n}.png`)
        ,supportedFonts = [{font:"z_corsiva",fontSize:8}, {font:"z_boli",fontSize:8}, {font:"z_swan",fontSize:18}, {font:"z_chaparrals",fontSize:8}, {font:"z_english",fontSize:9}];

        
        let init =()=>
        {
            log("Requesting SVG from server! ", version);
            // fetch(`/images/prism/svg/sketch.txt`,{ mode: 'no-cors' })
            // fetch(`/images/prism/svg/sketch.txt`,{ mode: 'no-cors' })
            const productElement = document.querySelector(".productId");
            const _sourceSVG = (productElement !== null) ? productElement : "HRT";
            console.log("Product: ",_sourceSVG)
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
                ,left: (isMobile) ? mobileSize.textLeft : desktopSize.textLeft 
                ,objectCaching:false
                ,textAlign:"center"
                ,top: (isMobile) ? mobileSize.textTop : desktopSize.textTop
                ,fontSize:fontChanger(fontColCount).fontSize
                ,padding:50
                ,fontFamily:fontChanger(fontColCount).font
            };

            userText = new fabric.IText("Click to edit",props);
            
            canvas.add(userText);
            userText.bringToFront();
            canvas.renderAll();
            return userText;
        };
    
      
        const actionButtons=()=>
        {
            let g = $(".canvasBtn").toArray();
            let h = $(".fontBtn").toArray();
            let j = $(".birthBtn").toArray();
            
            g.map((el,i)=> $(el).click(()=> {let x= (i > imgTypes.length) ? 0 : i; imgIndex = x; loadImageFromURL(imgTypes[x]);}));
            h.map((el,i)=> $(el).click(()=> activeFontSwap(i)));
            j.map((el,i)=> $(el).click(()=> {(trackAccents("accent") < maxAccent) ? loadBirthFromURL(el.id): null}));

        };
           
        const activeFontSwap = (num)=>
        {
            console.log("activeFontSwap",num);
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
                            cornerBackgroundColor: '#efefef',
                            cornerPadding:7
                    }
                    ,tl:{icon: `${blobUrl}/ico/delete.svg`,cornerColor:"red"}
                    ,tr:{icon: `${blobUrl}/ico/scale.svg`}
                    ,ml:{}
                    ,mr:{}
                    ,mt:{}
                    ,mb:{icon: `${blobUrl}/ico/align.svg`}
                    ,bl:{}
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
                },
                br: {
                    cursor: 'pointer'  
                    ,action: ()=>{
                        fontColCount = (fontColCount > 4) ? 0 : fontColCount;
                        let s = canvas.getActiveObject();
                        fontColCount++;
                        s.set({fontFamily:fontChanger(fontColCount).font,fontSize:fontChanger(fontColCount).fontSize});
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
            const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            isMobile = isMobileDevice;
            // console.log("mobile device detected: ",isMobileDevice);
            if (!isMobileDevice)
            {
                
                canvas.setWidth(450);
                canvas.setHeight(450);
                canvas.zoomToPoint(new fabric.Point(225, 225), 3);
            }
            else
            {
                canvas.setWidth(300);
                canvas.setHeight(300);
                canvas.zoomToPoint(new fabric.Point(150, 150), 3);
            }
        };
        
        const scaleCanvasDown=()=>
        {
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
                    left: (isMobile) ?  mobileSize.productLeft : desktopSize.productLeft, 
                    top: (isMobile) ? mobileSize.productTop : desktopSize.productTop,
                    angle: 0,
                    selectable: true,
                    customId: `${imageUrl}-${Date.now()}`,
                    classType: "sketch",
                    crossOrigin: 'anonymous'
                });
               
                if (imgObject) { canvas.remove(imgObject); } // Remove previous image if it exists
        
                img.selectable = false; // Add the new image to the canvas
                  
                canvas.add(img);
                canvas.moveTo(img, 1);
                canvas.renderAll();
                objectExit(img);
                imgObject = img; // Keep reference to the current image
                
            }, { crossOrigin: 'anonymous' });
        };

        const loadBirthFromURL = (imageUrl) => {
            let _birthStone = birthTypes.find(url => url.includes(imageUrl));
            const rndLeft = Math.floor(Math.random() * 21);
        //    log("accent name: ",_birthStone.endsWith("DIAMOND.png"));
            fabric.Image.fromURL(_birthStone, function(img) {
                img.scaleToWidth(8.6);
                img.set({
                    left: (isMobile) ? mobileSize.birthLeft + rndLeft : desktopSize.birthLeft + rndLeft, 
                    top: (isMobile) ? mobileSize.birthTop : desktopSize.birthTop, 
                    angle: 0,
                    selectable: true,
                    lockScalingX: true,  
                    lockScalingY: true,
                    lockScaling: true,
                    classType: 'accent', 
                    customId: `${_birthStone}-${Date.now()}`,
                    crossOrigin: 'anonymous'
                });


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

                
                canvas.add(img); // Add the new image to the canvas
                // canvas
                // canvas.add(circle); 
                canvas.bringToFront();
                canvas.renderAll();
                trackAccents("accent"); //update accent count
               
                // accentCount++;
                // objectExit(group);

            }, { crossOrigin: 'anonymous' });
        };
        
        const addCirclesToBirthstones = (className) => {
            const images = canvas.getObjects().filter(obj => obj.classType === className);
            images.forEach(obj => {
                // log(" ************* ",obj.customId.includes("DIAMOND"));
                const birth = new fabric.Circle({
                    radius: 3.9, 
                    fill: 'rgba(0,0,255,01)', 
                    stroke: 'rgba(0,0,0,0.3)', 
                    strokeWidth: 0,
                    left: obj.left, 
                    top: obj.top, 
                    selectable: true
                });
                // log("addd birth: ",images.length);
                const dia = new fabric.Circle({
                    radius: 2.7, 
                    fill: 'rgba(255,255,255,0)', 
                    stroke: 'rgba(0,0,0,1)', 
                    strokeWidth: 0.25,
                    left: obj.left+1.5, 
                    top: obj.top+1.5, 
                    selectable: true
                });
                canvas.add((obj.customId.includes("DIAMOND")) ? dia : birth);
                canvas.moveTo((obj.customId.includes("DIAMOND")) ? dia : birth, 1);
                canvas.renderAll();
            })
            console.log((images.length === 0) ? `Accent: ${className} not added` : `Accent': ${className} added`);
        };

        const trackAccents = (className)=> 
        {
            const images = canvas.getObjects().filter(obj => obj.classType === className);
            console.log((images.length === 0) ? `Class 'accent': ${className} not found` : `Class 'accent': ${className} found`);
            return images.length;
        }

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
        
                var dataURL = canvas.toDataURL({
                    format: 'png',
                    quality: 1.0
                  });
                 
                  var link = document.createElement('a'); // Trigger the download
                  link.href = dataURL;
                  link.download = 'canvas.png'; // Name of the downloaded file
                  link.click();
        
                canvasPng = dataURL; // Encode SVG to avoid parsing issues
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
            return supportedFonts[a];
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
                addCirclesToBirthstones("accent");
                // log("serialize: ", getCanvas(doc));
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
      
        //------------------------ CSCART DOM TRACKING ----------------------------->
        /*
        const findActiveFileInput = ()=> 
        {
            const inputs = Array.from(document.querySelectorAll('.ty-fileuploader__file-input[type="file"]'))
                .filter(input => input.offsetParent !== null); 
            // Return the most recently added one (last in list)
            alert(inputs.length);
            return inputs[inputs.length - 1] || null;
        }
        const serializeCanvasToFile = ()=> 
        {

            const x = parser.parseFromString(getCanvas(doc),"image/svg+xml");
            const svgExport = svgDown(x);
            const blob = new Blob([svgExport], { type: "image/svg+xml" });

            // const svgDoc = parser.parseFromString(getCanvas(document), "image/svg+xml");
            // const svgExport = svgDown(svgDoc);
            // const blob = new Blob([svgExport], { type: "image/svg+xml" });
            return new File([blob], "canvas.svg", { type: "image/svg+xml" });
        }

        const injectFileIntoInput =(file, input)=>
        {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
    
            // Trigger CS-Cart’s native upload handler
            const changeEvent = new Event("change", { bubbles: true });
            input.dispatchEvent(changeEvent);
    
            console.log("[Canvas Uploaded] Injected file into:", input);
        }

        const handleKeyupSerialize= ()=> 
        {
            const input = findActiveFileInput();
            if (!input) {
                console.warn("[Canvas Upload] No visible file input found.");
                return;
            }
    
            const canvasFile = serializeCanvasToFile();
            injectFileIntoInput(canvasFile, input);
        }
        
        let serializeTimeout;
        document.addEventListener("keyup", (e) => {
            if (e.key === "Enter" || (e.ctrlKey && e.key.toLowerCase() === "s")) {
                e.preventDefault();
                clearTimeout(serializeTimeout);
                serializeTimeout = setTimeout(() => {
                    handleKeyupSerialize();
                }, 200);
            }
        });
        */
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        console.log("PRISM: DOM updated, re-checking inputs.");
                    }, 50);
                    break;
                }
            }
        });
        
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
            observer.observe(document.body, { childList: true, subtree: true });
        })();
        
    })();