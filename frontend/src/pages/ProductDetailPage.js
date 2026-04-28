import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

var SHIRT_SHAPES = {
  'round-neck': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M90,40 Q100,20 120,18 Q150,30 180,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M120,18 Q150,45 180,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
  'polo': function(color, stroke) {
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
  },
  'v-neck': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M90,40 Q100,20 115,18 L150,60 L185,18 Q200,20 210,40 L260,80 L240,120 L210,105 L210,280 L90,280 L90,105 L60,120 L40,80 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M115,18 L150,60 L185,18" fill="none" stroke={stroke} strokeWidth="2.5"/>
        <path d="M90,40 L40,80 L60,120 L90,105" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M210,40 L260,80 L240,120 L210,105" fill={color} stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
  'hoodie': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M85,55 L75,35 Q100,10 130,15 L150,35 L170,15 Q200,10 225,35 L215,55 L265,95 L245,135 L215,118 L215,295 L85,295 L85,118 L55,135 L35,95 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M115,18 Q150,5 185,18 L185,45 Q150,55 115,45 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <ellipse cx="150" cy="38" rx="24" ry="18" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M105,190 Q150,185 195,190 L195,230 Q150,235 105,230 Z" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5"/>
        <path d="M85,55 L35,95 L55,135 L85,118" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M215,55 L265,95 L245,135 L215,118" fill={color} stroke={stroke} strokeWidth="2"/>
        <rect x="85" y="283" width="130" height="14" rx="4" fill={color} stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  },
  'tank-top': function(color, stroke) {
    return (
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        <path d="M100,15 Q115,5 150,10 Q185,5 200,15 L220,55 L200,65 L200,265 L100,265 L100,65 L80,55 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M100,15 L80,55 L100,65 L115,45 Q118,18 120,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M200,15 L220,55 L200,65 L185,45 Q182,18 180,15 Z" fill={color} stroke={stroke} strokeWidth="2"/>
        <path d="M120,15 Q150,30 180,15" fill="none" stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  },
};

function isDark(hex) {
  if (!hex || hex.length < 4) return false;
  var h = hex.replace('#','');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var r = parseInt(h.slice(0,2),16);
  var g = parseInt(h.slice(2,4),16);
  var b = parseInt(h.slice(4,6),16);
  return (r*0.299 + g*0.587 + b*0.114) < 140;
}

function DraggableDesign({ element, selected, onSelect, onUpdate, canvasRef }) {
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

export default function ProductDetailPage() {
  var { id } = useParams();
  var navigate = useNavigate();
  var [searchParams] = useSearchParams();
  var { addToCart } = useCart();
  var canvasRef = useRef(null);

  var [product, setProduct] = useState(null);
  var [loading, setLoading] = useState(true);
  var [selectedColor, setSelectedColor] = useState(null);
  var [selectedSize, setSelectedSize] = useState(null);
  var [selectedPrintArea, setSelectedPrintArea] = useState('front');
  var [designText, setDesignText] = useState('');
  var [designNotes, setDesignNotes] = useState('');
  var [quantity, setQuantity] = useState(1);
  var [designFile, setDesignFile] = useState(null);
  var [designPreview, setDesignPreview] = useState(null);
  var [elements, setElements] = useState([]);
  var [selectedEl, setSelectedEl] = useState(null);
  var [activeTab, setActiveTab] = useState('details');
  var [showSizeGuide, setShowSizeGuide] = useState(false);
  var [mainImageIdx, setMainImageIdx] = useState(0);

  var fromCustomizer = searchParams.get('fromCustomizer') === '1';

  useEffect(function() {
    api.get('/products/' + id).then(function(res) {
      var p = res.data.product;
      setProduct(p);
      setSelectedSize(p.sizes && p.sizes[0] && p.sizes[0].size);

      var pending = sessionStorage.getItem('pendingCustomization');
      if (pending && fromCustomizer) {
        try {
          var customization = JSON.parse(pending);
          sessionStorage.removeItem('pendingCustomization');
          if (customization.colorHex && p.colors) {
            var matched = p.colors.find(function(c) { return c.hex === customization.colorHex; });
            setSelectedColor(matched || p.colors[0]);
          } else {
            setSelectedColor(p.colors && p.colors[0]);
          }
          if (customization.elements && customization.elements.length > 0) {
            setElements(customization.elements);
            setActiveTab('design');
            setTimeout(function() { toast.success('Your design has been loaded! 🎨'); }, 500);
          }
        } catch(e) {
          setSelectedColor(p.colors && p.colors[0]);
        }
      } else {
        setSelectedColor(p.colors && p.colors[0]);
      }
    }).catch(function() { navigate('/products'); })
    .finally(function() { setLoading(false); });
  }, [id, navigate, fromCustomizer]);

  if (loading) return (
    <div className="page flex-center" style={{ minHeight:'60vh' }}>
      <div className="spinner" style={{ width:40, height:40 }} />
    </div>
  );
  if (!product) return null;

  var category = product.category || 'round-neck';
  var shirtFn = SHIRT_SHAPES[category] || SHIRT_SHAPES['round-neck'];
  var colorHex = selectedColor ? selectedColor.hex : '#FFFFFF';
  var strokeColor = isDark(colorHex) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';

  var sizeInfo = product.sizes && product.sizes.find(function(s) { return s.size === selectedSize; });
  var printAreaInfo = product.printAreas && product.printAreas.find(function(p) { return p.name === selectedPrintArea; });
  var unitPrice = product.basePrice + (sizeInfo ? sizeInfo.additionalPrice||0 : 0) + (printAreaInfo ? printAreaInfo.additionalPrice||0 : 0);
  var bulkTier = product.bulkPricing && product.bulkPricing.filter(function(b) { return quantity >= b.minQty; }).sort(function(a,b){ return b.minQty - a.minQty; })[0];
  var discount = bulkTier ? (unitPrice * bulkTier.discount) / 100 : 0;
  var finalPrice = unitPrice - discount;
  var mrp = Math.round(unitPrice * 1.4); // Show MRP as 40% higher

  // Build thumbnail list: color swatches first, then product images
  var thumbnails = [];
  if (product.colors) {
    product.colors.forEach(function(c) {
      thumbnails.push({ type: 'color', color: c });
    });
  }
  if (product.images) {
    product.images.forEach(function(img) {
      if (img.url && !img.url.includes('placeholder')) {
        thumbnails.push({ type: 'image', url: img.url });
      }
    });
  }

  var handleAddText = function() {
    if (!designText.trim()) return;
    var newId = Date.now();
    setElements(function(prev) { return [...prev, { id:newId, type:'text', text:designText, color:'#000000', x:25, y:30, width:50, height:15 }]; });
    setSelectedEl(newId);
  };

  var handleFileChange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    setDesignFile(file);
    var reader = new FileReader();
    reader.onload = function(ev) {
      setDesignPreview(ev.target.result);
      var newId = Date.now();
      setElements(function(prev) { return [...prev, { id:newId, type:'image', src:ev.target.result, x:20, y:25, width:60, height:35 }]; });
      setSelectedEl(newId);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  var updateElement = function(elId, props) {
    setElements(function(prev) { return prev.map(function(el) { return el.id === elId ? Object.assign({}, el, props) : el; }); });
  };

  var deleteElement = function(elId) {
    setElements(function(prev) { return prev.filter(function(el) { return el.id !== elId; }); });
    if (selectedEl === elId) setSelectedEl(null);
  };

  var doAddToCart = function() {
    if (!selectedSize) return toast.error('Please select a size');
    if (!selectedColor) return toast.error('Please select a color');
    addToCart({
      product: product._id,
      productName: product.name,
      category: category,
      size: selectedSize,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      customization: {
        designText: designText,
        printArea: selectedPrintArea,
        notes: designNotes,
        designFile: designFile || null,
        designPreview: designPreview || null,
      },
      unitPrice: finalPrice,
      quantity: quantity,
    });
    toast.success('Added to cart!');
  };

  var handleBuyNow = function() {
    if (!selectedSize) return toast.error('Please select a size');
    if (!selectedColor) return toast.error('Please select a color');
    doAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="page pdp-page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <span onClick={function(){navigate('/');}} className="bc-link">Home</span>
          <span className="bc-sep">›</span>
          <span onClick={function(){navigate('/products');}} className="bc-link">Shop</span>
          <span className="bc-sep">›</span>
          <span onClick={function(){navigate('/products?category='+category);}} className="bc-link">{category.replace('-',' ').replace(/\b\w/g,function(l){return l.toUpperCase();})}</span>
          <span className="bc-sep">›</span>
          <span className="bc-current">{product.name}</span>
        </div>

        {fromCustomizer && elements.length > 0 && (
          <div className="pdp-customizer-banner">
            🎨 Your design from the customizer has been loaded! Review it in the Design tab, then add to cart.
          </div>
        )}

        <div className="pdp-layout">

          {/* ── LEFT: Thumbnail Strip + Main Image ── */}
          <div className="pdp-gallery">
            {/* Vertical thumbnail strip */}
            <div className="pdp-thumbs">
              {thumbnails.map(function(thumb, i) {
                return (
                  <div
                    key={i}
                    className={'pdp-thumb' + (mainImageIdx === i ? ' active' : '')}
                    onClick={function() {
                      setMainImageIdx(i);
                      if (thumb.type === 'color') setSelectedColor(thumb.color);
                    }}
                  >
                    {thumb.type === 'color' ? (
                      <div className="pdp-thumb-shirt">
                        {shirtFn(thumb.color.hex, isDark(thumb.color.hex) ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
                      </div>
                    ) : (
                      <img src={thumb.url} alt="product" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:6 }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Main display */}
            <div
              className="pdp-main-image"
              ref={canvasRef}
              onClick={function() { setSelectedEl(null); }}
            >
              {/* Shirt SVG */}
              <div className="pdp-main-shirt-svg">
                {shirtFn(colorHex, strokeColor)}
              </div>

              {/* Design elements */}
              {elements.length === 0 && (
                <div className="pdp-design-placeholder">
                  <div className="pdp-placeholder-box">Click "Design" tab to add your artwork</div>
                </div>
              )}
              {elements.map(function(el) {
                return (
                  <DraggableDesign
                    key={el.id}
                    element={el}
                    selected={selectedEl === el.id}
                    onSelect={function() { setSelectedEl(el.id); }}
                    onUpdate={function(props) { updateElement(el.id, props); }}
                    canvasRef={canvasRef}
                  />
                );
              })}

              {/* Zoom badge */}
              <div className="pdp-zoom-badge">🔍 Interactive Preview</div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="pdp-info">

            {/* Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price block */}
            <div className="pdp-price-block">
              <span className="pdp-price">&#8377;{finalPrice.toFixed(0)}</span>
              <span className="pdp-mrp">&#8377;{mrp}</span>
              <span className="pdp-discount-pct">{Math.round(((mrp - finalPrice) / mrp) * 100)}% off</span>
            </div>

            {/* Bulk discount badges */}
            {product.bulkPricing && product.bulkPricing.length > 0 && (
              <div className="pdp-bulk-badges">
                {product.bulkPricing.map(function(b) {
                  return (
                    <span key={b.minQty} className="pdp-bulk-badge">
                      🏷️ Buy {b.minQty}+ get {b.discount}% off
                    </span>
                  );
                })}
              </div>
            )}

            {/* Color */}
            <div className="pdp-option-block">
              <div className="pdp-option-label">
                Color: <strong>{selectedColor && selectedColor.name}</strong>
              </div>
              <div className="pdp-color-swatches">
                {product.colors && product.colors.map(function(c, i) {
                  return (
                    <div
                      key={c.hex}
                      className={'pdp-color-swatch' + (selectedColor && selectedColor.hex === c.hex ? ' active' : '')}
                      onClick={function() { setSelectedColor(c); setMainImageIdx(i); }}
                      title={c.name}
                    >
                      <div className="pdp-swatch-shirt">
                        {shirtFn(c.hex, isDark(c.hex) ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)')}
                      </div>
                      <span className="pdp-swatch-name">{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="pdp-option-block">
              <div className="pdp-option-label" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span>Size: <strong>{selectedSize}</strong></span>
                <button className="pdp-size-guide-btn" onClick={function(){ setShowSizeGuide(true); }}>
                  📏 Size Guide
                </button>
              </div>
              <div className="pdp-size-pills">
                {product.sizes && product.sizes.map(function(s) {
                  return (
                    <button
                      key={s.size}
                      className={'pdp-size-pill' + (selectedSize === s.size ? ' active' : '')}
                      onClick={function() { setSelectedSize(s.size); }}
                    >
                      {s.size}
                      {s.additionalPrice > 0 && <span className="pdp-size-extra">+&#8377;{s.additionalPrice}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Print Area */}
            {product.printAreas && product.printAreas.length > 0 && (
              <div className="pdp-option-block">
                <div className="pdp-option-label">Print Area</div>
                <div className="pdp-print-areas">
                  {product.printAreas.map(function(pa) {
                    return (
                      <button
                        key={pa.name}
                        className={'pdp-print-btn' + (selectedPrintArea === pa.name ? ' active' : '')}
                        onClick={function() { setSelectedPrintArea(pa.name); }}
                      >
                        {pa.name.replace('-',' ')}
                        {pa.additionalPrice > 0 && <span> +&#8377;{pa.additionalPrice}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pdp-option-block">
              <div className="pdp-option-label">Quantity</div>
              <div className="pdp-qty-wrap">
                <div className="pdp-qty">
                  <button className="pdp-qty-btn" onClick={function(){ setQuantity(function(q){ return Math.max(1,q-1); }); }}>&#8722;</button>
                  <span className="pdp-qty-val">{quantity}</span>
                  <button className="pdp-qty-btn" onClick={function(){ setQuantity(function(q){ return q+1; }); }}>+</button>
                </div>
                {bulkTier && (
                  <span className="pdp-bulk-active">🎉 {bulkTier.discount}% bulk discount applied!</span>
                )}
              </div>
            </div>

            {/* Total price */}
            <div className="pdp-total-row">
              <span>Total ({quantity} piece{quantity>1?'s':''})</span>
              <span className="pdp-total-val">&#8377;{(finalPrice * quantity).toFixed(0)}</span>
            </div>

            {/* CTA Buttons */}
            <div className="pdp-cta-group">
              <button className="pdp-btn-cart" onClick={doAddToCart}>
                🛒 Add to Cart — &#8377;{(finalPrice * quantity).toFixed(0)}
              </button>
              <button className="pdp-btn-buy" onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>

            {/* Design tab */}
            <div className="pdp-design-section">
              <div className="pdp-design-tabs">
                <button className={'pdt-tab'+(activeTab==='details'?' active':'')} onClick={function(){setActiveTab('details');}}>📋 Details</button>
                <button className={'pdt-tab'+(activeTab==='design'?' active':'')} onClick={function(){setActiveTab('design');}}>✏️ Customise</button>
                <button className={'pdt-tab'+(activeTab==='notes'?' active':'')} onClick={function(){setActiveTab('notes');}}>📝 Notes</button>
              </div>

              {activeTab === 'details' && (
                <div className="pdt-content fade-in">
                  <p style={{ color:'var(--ink-muted)', lineHeight:1.7, fontSize:'0.95rem' }}>{product.description}</p>
                  <div className="pdp-features">
                    <div className="pdp-feature-item">✅ Premium quality fabric</div>
                    <div className="pdp-feature-item">✅ High-resolution printing</div>
                    <div className="pdp-feature-item">✅ Wash-safe colours</div>
                    <div className="pdp-feature-item">✅ Delivered in 48-72 hours</div>
                  </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="pdt-content fade-in">
                  <div className="pdp-design-tip">
                    🎨 Your design appears live on the shirt preview. Drag to move, corner handle to resize.
                  </div>
                  <div className="pdp-design-field">
                    <label className="pdp-field-label">Add Text</label>
                    <div style={{ display:'flex', gap:8 }}>
                      <input
                        className="input"
                        placeholder="Your text, slogan, name..."
                        value={designText}
                        maxLength={40}
                        onChange={function(e){ setDesignText(e.target.value); }}
                        onKeyDown={function(e){ if(e.key==='Enter') handleAddText(); }}
                        style={{ flex:1 }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={handleAddText} disabled={!designText.trim()}>
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="pdp-design-field">
                    <label className="pdp-field-label">Upload Design Image</label>
                    <input type="file" id="pdp-file" accept="image/*,.pdf" style={{display:'none'}} onChange={handleFileChange} />
                    <label htmlFor="pdp-file" className="pdp-upload-btn">
                      {designPreview ? (
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <img src={designPreview} alt="design" style={{ width:48, height:48, objectFit:'contain', borderRadius:6, border:'1px solid var(--border)' }} />
                          <div>
                            <div style={{ fontWeight:600, fontSize:'0.85rem' }}>✓ Design uploaded</div>
                            <div style={{ fontSize:'0.75rem', color:'var(--ink-muted)' }}>Click to change</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:'1.8rem' }}>🖼️</span>
                          <div>
                            <div style={{ fontWeight:600, fontSize:'0.88rem' }}>Upload your design</div>
                            <div style={{ fontSize:'0.75rem', color:'var(--ink-muted)' }}>PNG, JPG, PDF up to 10MB</div>
                          </div>
                        </div>
                      )}
                    </label>
                    {designPreview && (
                      <button className="btn btn-outline btn-sm" style={{ marginTop:6 }}
                        onClick={function(){ setDesignFile(null); setDesignPreview(null); setElements(function(prev){ return prev.filter(function(el){ return el.type!=='image'; }); }); }}>
                        ✕ Remove image
                      </button>
                    )}
                  </div>
                  {elements.length > 0 && (
                    <div className="pdp-layers">
                      <div className="pdp-layers-title">Layers</div>
                      {elements.map(function(el) {
                        return (
                          <div key={el.id} className={'pdp-layer'+(selectedEl===el.id?' active':'')} onClick={function(){setSelectedEl(el.id);}}>
                            <span>{el.type==='image'?'🖼️':'✏️'}</span>
                            <span style={{ flex:1, fontSize:'0.82rem' }}>{el.type==='text'?'"'+el.text.slice(0,20)+'"':'Image'}</span>
                            <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-muted)', fontSize:'0.75rem', padding:'2px 6px', borderRadius:4 }}
                              onClick={function(e){ e.stopPropagation(); deleteElement(el.id); }}>✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="pdt-content fade-in">
                  <label className="pdp-field-label">Special Instructions for our print team</label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Describe exact placement, font preference, color details, or anything special..."
                    value={designNotes}
                    onChange={function(e){ setDesignNotes(e.target.value); }}
                    style={{ resize:'vertical', marginTop:8 }}
                  />
                  <div style={{ fontSize:'0.78rem', color:'var(--ink-muted)', marginTop:6 }}>
                    Our design team reads every note before printing. 🖨️
                  </div>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="pdp-trust-panel">
              <div className="pdp-trust-header">
                <span>🛡️</span> Security &amp; Service
                <span style={{ marginLeft:'auto', fontSize:'1rem' }}>▾</span>
              </div>
              <div className="pdp-trust-grid">
                <div className="pdp-trust-item">
                  <span className="pdp-trust-icon">💳</span>
                  <span>Payment Security</span>
                </div>
                <div className="pdp-trust-item">
                  <span className="pdp-trust-icon">🔒</span>
                  <span>Privacy Protection</span>
                </div>
                <div className="pdp-trust-item">
                  <span className="pdp-trust-icon">🚚</span>
                  <span>Fast &amp; Safe Logistics</span>
                </div>
                <div className="pdp-trust-item">
                  <span className="pdp-trust-icon">🤝</span>
                  <span>Customer Service</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="pdp-modal-overlay" onClick={function(){ setShowSizeGuide(false); }}>
          <div className="pdp-modal" onClick={function(e){ e.stopPropagation(); }}>
            <div className="pdp-modal-header">
              <h3>📏 Size Guide (in cm)</h3>
              <button className="pdp-modal-close" onClick={function(){ setShowSizeGuide(false); }}>✕</button>
            </div>
            <table className="pdp-size-table">
              <thead>
                <tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th><th>Sleeve</th></tr>
              </thead>
              <tbody>
                {[
                  ['XS', '86-91', '68', '40', '19'],
                  ['S',  '91-96', '70', '42', '20'],
                  ['M',  '96-101','72', '44', '21'],
                  ['L',  '101-106','74','46', '22'],
                  ['XL', '106-111','76','48', '23'],
                  ['XXL','111-116','78','50', '24'],
                ].map(function(row) {
                  return (
                    <tr key={row[0]} className={selectedSize === row[0] ? 'highlighted-row' : ''}>
                      {row.map(function(cell, i) { return <td key={i}>{cell}</td>; })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pdp-size-tip">
              💡 Measure around the fullest part of your chest. If between sizes, size up for a relaxed fit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}