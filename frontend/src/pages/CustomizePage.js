import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './CustomizePage.css';

var SHIRT_SHAPES = {
  'round-neck': {
    label: 'Round Neck',
    svg: function(color, stroke) {
      return (
        <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M90,40 Q100,20 120,18 Q150,30 180,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M120,18 Q150,45 180,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
          <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
          <line x1="150" y1="50" x2="150" y2="280" stroke={stroke} strokeWidth="0.5" opacity="0.2"/>
        </svg>
      );
    }
  },
  'polo': {
    label: 'Polo',
    svg: function(color, stroke) {
      return (
        <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M90,45 L85,30 L115,20 L130,40 L150,50 L170,40 L185,20 L215,30 L210,45 L260,85 L240,125 L210,110 L210,280 L90,280 L90,110 L60,125 L40,85 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M115,20 L130,40 L150,50 L145,20 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
          <path d="M185,20 L170,40 L150,50 L155,20 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
          <rect x="140" y="18" width="20" height="32" rx="2" fill={color} stroke={stroke} strokeWidth="1.5"/>
          <circle cx="150" cy="25" r="2" fill={stroke} opacity="0.5"/>
          <circle cx="150" cy="33" r="2" fill={stroke} opacity="0.5"/>
          <circle cx="150" cy="41" r="2" fill={stroke} opacity="0.5"/>
          <path d="M90,45 L40,85 L60,125 L90,110" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M210,45 L260,85 L240,125 L210,110" fill={color} stroke={stroke} strokeWidth="2"/>
        </svg>
      );
    }
  },
  'v-neck': {
    label: 'V-Neck',
    svg: function(color, stroke) {
      return (
        <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M90,40 Q100,20 115,18 L150,60 L185,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M115,18 L150,60 L185,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
          <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
        </svg>
      );
    }
  },
  'hoodie': {
    label: 'Hoodie',
    svg: function(color, stroke) {
      return (
        <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M85,55 L75,35 Q100,10 130,15 L150,35 L170,15 Q200,10 225,35 L215,55 L265,95 L245,135 L215,118 L215,295 L85,295 L85,118 L55,135 L35,95 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M115,18 Q150,5 185,18 L185,45 Q150,55 115,45 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <ellipse cx="150" cy="38" rx="24" ry="18" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M105,190 Q150,185 195,190 L195,230 Q150,235 105,230 Z" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5"/>
          <line x1="138" y1="55" x2="130" y2="90" stroke={stroke} strokeWidth="1.5" opacity="0.4"/>
          <line x1="162" y1="55" x2="170" y2="90" stroke={stroke} strokeWidth="1.5" opacity="0.4"/>
          <path d="M85,55 L35,95 L55,135 L85,118" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M215,55 L265,95 L245,135 L215,118" fill={color} stroke={stroke} strokeWidth="2"/>
          <rect x="35" y="125" width="28" height="12" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
          <rect x="237" y="125" width="28" height="12" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
          <rect x="85" y="283" width="130" height="14" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
        </svg>
      );
    }
  },
  'tank-top': {
    label: 'Tank Top',
    svg: function(color, stroke) {
      return (
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M100,15 Q115,5 150,10 Q185,5 200,15 L220,55 L200,65 L200,265 L100,265 L100,65 L80,55 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M100,15 L80,55 L100,65 L115,45 Q118,18 120,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M200,15 L220,55 L200,65 L185,45 Q182,18 180,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
          <path d="M120,15 Q150,30 180,15" fill="none" stroke={stroke} strokeWidth="2"/>
        </svg>
      );
    }
  },
};

var TSHIRT_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Navy', hex: '#1a237e' },
  { name: 'Red', hex: '#c62828' },
  { name: 'Grey', hex: '#9e9e9e' },
  { name: 'Royal Blue', hex: '#1565c0' },
  { name: 'Green', hex: '#2e7d32' },
  { name: 'Maroon', hex: '#880e4f' },
  { name: 'Orange', hex: '#e65100' },
  { name: 'Yellow', hex: '#f9a825' },
];

var FONTS = [
  { id: 'bold', label: 'Bold', css: 'Impact, sans-serif' },
  { id: 'serif', label: 'Serif', css: 'Georgia, serif' },
  { id: 'hand', label: 'Handwritten', css: 'cursive' },
  { id: 'block', label: 'Block', css: 'Arial Black, sans-serif' },
  { id: 'script', label: 'Script', css: 'Palatino, serif' },
];

function isDark(hex) {
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return (r*0.299 + g*0.587 + b*0.114) < 140;
}

function DesignElement({ element, selected, onSelect, onUpdate, canvasRef }) {
  var dragState = useRef(null);
  var resizeState = useRef(null);

  var handleMouseDown = useCallback(function(e) {
    e.stopPropagation();
    onSelect();
    var rect = canvasRef.current.getBoundingClientRect();
    dragState.current = { startX:e.clientX, startY:e.clientY, origX:element.x, origY:element.y, rect:rect };
    function onMove(ev) {
      if (!dragState.current) return;
      var dx = ((ev.clientX - dragState.current.startX) / dragState.current.rect.width) * 100;
      var dy = ((ev.clientY - dragState.current.startY) / dragState.current.rect.height) * 100;
      onUpdate({ x: Math.max(0, Math.min(90, dragState.current.origX + dx)), y: Math.max(0, Math.min(85, dragState.current.origY + dy)) });
    }
    function onUp() { dragState.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onSelect, onUpdate, canvasRef]);

  var handleResizeDown = useCallback(function(e) {
    e.stopPropagation();
    var rect = canvasRef.current.getBoundingClientRect();
    resizeState.current = { startX:e.clientX, startY:e.clientY, origW:element.width, origH:element.height, rect:rect };
    function onMove(ev) {
      if (!resizeState.current) return;
      var dw = ((ev.clientX - resizeState.current.startX) / resizeState.current.rect.width) * 100;
      var dh = ((ev.clientY - resizeState.current.startY) / resizeState.current.rect.height) * 100;
      onUpdate({ width: Math.max(8, Math.min(80, resizeState.current.origW + dw)), height: Math.max(8, Math.min(70, resizeState.current.origH + dh)) });
    }
    function onUp() { resizeState.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, onUpdate, canvasRef]);

  return (
    <div
      style={{ position:'absolute', left:element.x+'%', top:element.y+'%', width:element.width+'%', height:element.height+'%', cursor:'move', userSelect:'none', boxSizing:'border-box' }}
      onMouseDown={handleMouseDown}
    >
      {element.type === 'image' && (
        <img src={element.src} alt="design" style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none' }} />
      )}
      {element.type === 'text' && (
        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:element.fontCss, fontWeight:'bold', textAlign:'center', wordBreak:'break-word', lineHeight:1.2, pointerEvents:'none', color:element.color||'#000', fontSize:'clamp(8px,3vw,28px)' }}>
          {element.text}
        </div>
      )}
      {selected && (
        <>
          <div style={{ position:'absolute', inset:-2, border:'2px dashed #e84545', borderRadius:4, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-7, right:-7, width:14, height:14, background:'#e84545', borderRadius:3, cursor:'se-resize', zIndex:10 }} onMouseDown={handleResizeDown} />
          <div style={{ position:'absolute', top:'calc(100% + 4px)', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.7)', color:'white', fontSize:'0.6rem', padding:'2px 7px', borderRadius:4, whiteSpace:'nowrap', pointerEvents:'none', zIndex:20 }}>
            Drag to move · Corner to resize
          </div>
        </>
      )}
    </div>
  );
}

export default function CustomizePage() {
  var navigate = useNavigate();
  var { user } = useAuth();
  var { addToCart } = useCart();

  var [selectedCategory, setSelectedCategory] = useState('round-neck');
  var [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[0]);
  var [elements, setElements] = useState([]);
  var [selectedEl, setSelectedEl] = useState(null);
  var [designText, setDesignText] = useState('');
  var [textColor, setTextColor] = useState('#000000');
  var [selectedFont, setSelectedFont] = useState(FONTS[0]);
  var [fontSize, setFontSize] = useState(3);
  var [activeTab, setActiveTab] = useState('style');
  var [ordering, setOrdering] = useState(false);
  var [selectedSize, setSelectedSize] = useState('M');
  var [quantity, setQuantity] = useState(1);
  var [uploadedFile, setUploadedFile] = useState(null);
  var canvasRef = useRef(null);

  var shirtShape = SHIRT_SHAPES[selectedCategory] || SHIRT_SHAPES['round-neck'];
  var strokeColor = isDark(selectedColor.hex) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';

  var handleAddText = function() {
    if (!designText.trim()) return;
    var newId = Date.now();
    setElements(function(prev) {
      return [...prev, { id:newId, type:'text', text:designText, color:textColor, fontCss:selectedFont.css, fontSize:fontSize, x:25, y:30, width:50, height:15 }];
    });
    setSelectedEl(newId);
    setDesignText('');
  };

  var handleImageUpload = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    var reader = new FileReader();
    reader.onload = function(ev) {
      var newId = Date.now();
      setElements(function(prev) {
        return [...prev, { id:newId, type:'image', src:ev.target.result, file:file, x:20, y:25, width:60, height:35 }];
      });
      setSelectedEl(newId);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  var updateElement = function(id, props) {
    setElements(function(prev) {
      return prev.map(function(el) { return el.id === id ? Object.assign({}, el, props) : el; });
    });
  };

  var deleteSelected = function() {
    setElements(function(prev) { return prev.filter(function(el) { return el.id !== selectedEl; }); });
    setSelectedEl(null);
  };

  useEffect(function() {
    if (selectedEl) {
      var el = elements.find(function(e) { return e.id === selectedEl; });
      if (el && el.type === 'text') {
        updateElement(selectedEl, { color:textColor, fontCss:selectedFont.css, fontSize:fontSize });
      }
    }
  }, [textColor, selectedFont, fontSize]);

  // Export canvas as image for storage
  var exportDesignAsImage = function() {
    return new Promise(function(resolve) {
      var canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 680;
      var ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = selectedColor.hex;
      ctx.fillRect(0, 0, 600, 680);

      // Draw text elements
      elements.forEach(function(el) {
        if (el.type === 'text') {
          ctx.save();
          ctx.fillStyle = el.color || '#000000';
          ctx.font = 'bold ' + Math.round(el.fontSize * 10) + 'px ' + (el.fontCss || 'Arial');
          ctx.textAlign = 'center';
          var x = (el.x / 100) * 600 + ((el.width / 100) * 600) / 2;
          var y = (el.y / 100) * 680 + 30;
          ctx.fillText(el.text, x, y);
          ctx.restore();
        }
      });

      // Draw image elements
      var imageEls = elements.filter(function(el) { return el.type === 'image'; });
      if (imageEls.length === 0) {
        resolve(canvas.toDataURL('image/png'));
        return;
      }

      var loaded = 0;
      imageEls.forEach(function(el) {
        var img = new Image();
        img.onload = function() {
          var x = (el.x / 100) * 600;
          var y = (el.y / 100) * 680;
          var w = (el.width / 100) * 600;
          var h = (el.height / 100) * 680;
          ctx.drawImage(img, x, y, w, h);
          loaded++;
          if (loaded === imageEls.length) {
            resolve(canvas.toDataURL('image/png'));
          }
        };
        img.onerror = function() {
          loaded++;
          if (loaded === imageEls.length) {
            resolve(canvas.toDataURL('image/png'));
          }
        };
        img.src = el.src;
      });
    });
  };

  var handleOrderThisStyle = async function() {
    if (!user) {
      toast.error('Please login first to place an order');
      navigate('/login?redirect=/customize');
      return;
    }

    setOrdering(true);
    try {
      // Step 1: Find matching product
      var res = await api.get('/products?limit=1&category=' + selectedCategory);
      var products = res.data.products || [];

      if (products.length === 0) {
        toast.error('No products found for this style. Please try another.');
        setOrdering(false);
        return;
      }

      var product = products[0];

      // Step 2: Export design as flat image
      var designDataUrl = null;
      var designFile = null;
      if (elements.length > 0) {
        designDataUrl = await exportDesignAsImage();
        // Convert base64 to File object for upload
        var blob = await fetch(designDataUrl).then(function(r) { return r.blob(); });
        designFile = new File([blob], 'custom-design-' + Date.now() + '.png', { type: 'image/png' });
      }

      // Step 3: Upload design to backend
      var designImageUrl = '';
      if (designFile) {
        var uploadForm = new FormData();
        uploadForm.append('designImages', designFile);
        uploadForm.append('items', JSON.stringify([{
          product: product._id,
          quantity: quantity,
          size: selectedSize,
          color: selectedColor.name,
          customization: { designText: '', printArea: 'front', notes: '', designImage: '' }
        }]));
        uploadForm.append('shippingAddress', JSON.stringify({ name:'', phone:'', street:'', city:'', state:'', zip:'', country:'India' }));
        uploadForm.append('payment', JSON.stringify({ method: 'stripe' }));

        // We don't create order here yet — just upload design via a temporary endpoint
        // Instead store design URL in sessionStorage for checkout
        designImageUrl = designDataUrl; // use base64 preview for cart display
      }

      // Step 4: Add to cart with full customization
      var textElements = elements.filter(function(el) { return el.type === 'text'; });
      var designTextStr = textElements.map(function(el) { return el.text; }).join(' | ');

      addToCart({
        product: product._id,
        productName: product.name,
        category: selectedCategory,
        size: selectedSize,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        customization: {
          designText: designTextStr,
          printArea: 'front',
          notes: 'Custom design from designer tool. Color: ' + selectedColor.name + ', Style: ' + selectedCategory,
          designFile: designFile || null,
          designPreview: designDataUrl || null,
          elements: elements,
        },
        unitPrice: product.basePrice,
        quantity: quantity,
      });

      toast.success('Custom design added to cart! 🎨');
      navigate('/cart');

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="page customize-page">
      <div className="container">
        <div className="page-header customize-header">
          <h1 className="page-title">T-Shirt Designer</h1>
          <p className="page-subtitle">Design your custom t-shirt — drag, resize and position your artwork</p>
        </div>

        <div className="designer-layout">

          {/* Controls */}
          <div className="designer-controls">

            <div className="designer-tabs">
              {[
                { id:'style', label:'👕 Style' },
                { id:'color', label:'🎨 Color' },
                { id:'text', label:'✏️ Text' },
                { id:'image', label:'🖼️ Image' },
              ].map(function(tab) {
                return (
                  <button key={tab.id} className={'dtab' + (activeTab===tab.id?' active':'')} onClick={function(){setActiveTab(tab.id);}}>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'style' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Choose Style</div>
                <div className="style-list">
                  {Object.keys(SHIRT_SHAPES).map(function(catId) {
                    var cat = SHIRT_SHAPES[catId];
                    return (
                      <div key={catId} className={'style-item'+(selectedCategory===catId?' selected':'')} onClick={function(){setSelectedCategory(catId);}}>
                        <div className="style-item-preview">{cat.svg(selectedColor.hex, strokeColor)}</div>
                        <span className="style-item-label">{cat.label}</span>
                        {selectedCategory===catId && <span className="style-item-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'color' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Shirt Color</div>
                <div className="color-palette">
                  {TSHIRT_COLORS.map(function(color) {
                    return (
                      <div key={color.hex} className={'palette-item'+(selectedColor.hex===color.hex?' selected':'')} onClick={function(){setSelectedColor(color);}} title={color.name}>
                        <div className="palette-swatch" style={{background:color.hex}} />
                        <span className="palette-name">{color.name}</span>
                        {selectedColor.hex===color.hex && <span className="palette-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Add Text</div>
                <div className="input-group" style={{marginBottom:16}}>
                  <label>Your Text</label>
                  <input className="input" placeholder="Enter text to add..." value={designText} maxLength={40}
                    onChange={function(e){setDesignText(e.target.value);}}
                    onKeyDown={function(e){if(e.key==='Enter') handleAddText();}}
                  />
                  <div style={{fontSize:'0.75rem',color:'var(--ink-muted)',marginTop:4}}>{designText.length}/40</div>
                </div>
                <div className="input-group" style={{marginBottom:16}}>
                  <label>Font Style</label>
                  <div className="font-list">
                    {FONTS.map(function(font) {
                      return (
                        <button key={font.id} className={'font-item'+(selectedFont.id===font.id?' active':'')} style={{fontFamily:font.css}} onClick={function(){setSelectedFont(font);}}>
                          {font.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="input-group" style={{marginBottom:16}}>
                  <label>Text Color</label>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <input type="color" value={textColor} onChange={function(e){setTextColor(e.target.value);}}
                      style={{width:44,height:44,border:'none',cursor:'pointer',borderRadius:8,padding:2}}
                    />
                    <span style={{fontSize:'0.85rem',color:'var(--ink-muted)'}}>{textColor}</span>
                  </div>
                </div>
                <div className="input-group" style={{marginBottom:20}}>
                  <label>Font Size: {fontSize}</label>
                  <input type="range" min="1" max="6" step="0.5" value={fontSize}
                    onChange={function(e){setFontSize(parseFloat(e.target.value));}}
                    style={{width:'100%'}}
                  />
                </div>
                <button className="btn btn-primary" style={{width:'100%'}} onClick={handleAddText}>
                  + Add Text to Shirt
                </button>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="tab-panel fade-in">
                <div className="tab-title">Upload Design Image</div>
                <input type="file" id="design-upload" accept="image/*" style={{display:'none'}} onChange={handleImageUpload} />
                <label htmlFor="design-upload" className="image-upload-zone">
                  <span style={{fontSize:'2.5rem'}}>🖼️</span>
                  <span className="iuz-title">Click to upload your design</span>
                  <span className="iuz-hint">PNG with transparent background works best<br/>JPG, WEBP accepted · Max 10MB</span>
                </label>
                <div className="upload-tips">
                  <div className="tip-title">Tips for best results:</div>
                  <ul>
                    <li>PNG with transparent background</li>
                    <li>Minimum 300 DPI resolution</li>
                    <li>High contrast prints clearest</li>
                    <li>Multiple images supported</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedEl && (
              <div className="element-controls">
                <div className="ec-title">
                  {(function(){
                    var el = elements.find(function(e){return e.id===selectedEl;});
                    return el ? (el.type==='text' ? '"'+el.text+'"' : 'Image selected') : '';
                  })()}
                </div>
                <div className="ec-row">
                  <div style={{fontSize:'0.82rem',color:'var(--ink-muted)'}}>Drag to move · Corner to resize</div>
                  <button className="btn btn-sm" style={{background:'#fee2e2',color:'#991b1b'}} onClick={deleteSelected}>🗑️ Delete</button>
                </div>
              </div>
            )}

            {elements.length > 0 && (
              <div className="layers-panel">
                <div className="layers-title">Layers ({elements.length})</div>
                {elements.map(function(el, i) {
                  return (
                    <div key={el.id} className={'layer-item'+(selectedEl===el.id?' active':'')} onClick={function(){setSelectedEl(el.id);}}>
                      <span className="layer-icon">{el.type==='image'?'🖼️':'✏️'}</span>
                      <span className="layer-label">{el.type==='text'?(el.text.slice(0,20)+(el.text.length>20?'...':'')):('Image '+(i+1))}</span>
                      <button className="layer-delete" onClick={function(e){e.stopPropagation();setElements(function(prev){return prev.filter(function(x){return x.id!==el.id;});});if(selectedEl===el.id)setSelectedEl(null);}}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="designer-canvas-wrap">
            <div className="canvas-toolbar">
              <span className="canvas-info">
                {selectedColor.name} · {shirtShape.label}
                {elements.length > 0 && ' · ' + elements.length + ' element' + (elements.length>1?'s':'')}
              </span>
              {elements.length > 0 && (
                <button className="btn btn-outline btn-sm" onClick={function(){setElements([]);setSelectedEl(null);}}>Clear All</button>
              )}
            </div>

            <div className="shirt-canvas" ref={canvasRef} onClick={function(){setSelectedEl(null);}}>
              <div className="shirt-svg-layer">
                {shirtShape.svg(selectedColor.hex, strokeColor)}
              </div>

              {elements.length === 0 && (
                <div className="print-zone-hint">
                  <div className="pz-label">Print Area</div>
                  <div className="pz-sub">Add text or image using the panel</div>
                </div>
              )}

              {elements.map(function(el) {
                return (
                  <DesignElement key={el.id} element={el} selected={selectedEl===el.id}
                    onSelect={function(){setSelectedEl(el.id);}}
                    onUpdate={function(props){updateElement(el.id,props);}}
                    canvasRef={canvasRef}
                  />
                );
              })}
            </div>

            {/* Order options */}
            <div className="order-options-panel">
              <h3 className="order-options-title">Order Details</h3>
              <div className="order-options-row">
                <div className="input-group" style={{flex:1}}>
                  <label>Size</label>
                  <div className="size-row">
                    {['XS','S','M','L','XL','XXL'].map(function(s) {
                      return (
                        <button key={s} className={'size-pill'+(selectedSize===s?' active':'')} onClick={function(){setSelectedSize(s);}}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="input-group" style={{minWidth:120}}>
                  <label>Quantity</label>
                  <div className="qty-control-inline">
                    <button className="qty-btn-sm" onClick={function(){setQuantity(function(q){return Math.max(1,q-1);});}}>−</button>
                    <span className="qty-val-sm">{quantity}</span>
                    <button className="qty-btn-sm" onClick={function(){setQuantity(function(q){return q+1;});}}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="canvas-cta">
              <div className="cta-note">
                {elements.length > 0
                  ? '✅ Your design will be saved and sent to our print team when you order.'
                  : '💡 Add text or upload an image above, then click to add to cart.'
                }
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{width:'100%', justifyContent:'center', gap:10}}
                onClick={handleOrderThisStyle}
                disabled={ordering}
              >
                {ordering
                  ? <><span className="spinner" style={{width:18,height:18}} /> Processing...</>
                  : '🛒 Add to Cart & Checkout →'
                }
              </button>
              {!user && (
                <div style={{textAlign:'center',marginTop:8,fontSize:'0.8rem',color:'rgba(255,255,255,0.6)'}}>
                  You will be asked to login before checkout
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}