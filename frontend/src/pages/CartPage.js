import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

// Mini SVG shirt preview per category
function MiniShirtPreview({ colorHex, category, designText, designPreview }) {
  var color = colorHex || '#FFFFFF';
  var isDark = (function(hex) {
    var h = hex.replace('#','');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var r = parseInt(h.slice(0,2),16);
    var g = parseInt(h.slice(2,4),16);
    var b = parseInt(h.slice(4,6),16);
    return (r*0.299 + g*0.587 + b*0.114) < 140;
  })(color);
  var stroke = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)';

  var shirtPath = (function() {
    switch(category) {
      case 'polo':
        return (
          <>
            <path d="M28,14 L26,9 L36,6 L40,13 L48,16 L56,13 L60,6 L70,9 L68,14 L82,27 L76,40 L67,35 L67,88 L29,88 L29,35 L20,40 L14,27 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M36,6 L40,13 L48,16 L46,6 Z" fill={color} stroke={stroke} strokeWidth="1"/>
            <path d="M60,6 L56,13 L48,16 L50,6 Z" fill={color} stroke={stroke} strokeWidth="1"/>
            <rect x="44" y="5" width="8" height="12" rx="1" fill={color} stroke={stroke} strokeWidth="1"/>
            <circle cx="48" cy="8" r="1" fill={stroke} opacity="0.6"/>
            <circle cx="48" cy="11" r="1" fill={stroke} opacity="0.6"/>
          </>
        );
      case 'v-neck':
        return (
          <>
            <path d="M28,12 Q32,6 36,5 L48,18 L60,5 Q64,6 68,12 L82,27 L76,40 L67,35 L67,88 L29,88 L29,35 L20,40 L14,27 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M36,5 L48,18 L60,5" fill="none" stroke={stroke} strokeWidth="1.5"/>
          </>
        );
      case 'hoodie':
        return (
          <>
            <path d="M27,17 L24,11 Q32,3 41,5 L48,11 L55,5 Q64,3 72,11 L69,17 L84,30 L78,43 L69,37 L69,92 L27,92 L27,37 L18,43 L12,30 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M36,6 Q48,2 60,6 L60,14 Q48,17 36,14 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <ellipse cx="48" cy="12" rx="8" ry="6" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M33,60 Q48,58 63,60 L63,73 Q48,75 33,73 Z" fill="none" stroke={stroke} strokeWidth="1" opacity="0.5"/>
          </>
        );
      case 'tank-top':
        return (
          <>
            <path d="M32,5 Q36,2 48,3 Q60,2 64,5 L70,17 L64,20 L64,85 L32,85 L32,20 L26,17 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M32,5 L26,17 L32,20 L37,14 Q38,6 39,5 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M64,5 L70,17 L64,20 L59,14 Q58,6 57,5 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M39,5 Q48,10 57,5" fill="none" stroke={stroke} strokeWidth="1.5"/>
          </>
        );
      default: // round-neck
        return (
          <>
            <path d="M28,12 Q32,5 38,4 Q48,9 58,4 Q64,5 68,12 L82,27 L76,40 L67,35 L67,88 L29,88 L29,35 L20,40 L14,27 Z" fill={color} stroke={stroke} strokeWidth="1.5"/>
            <path d="M38,4 Q48,14 58,4" fill="none" stroke={stroke} strokeWidth="1.5"/>
          </>
        );
    }
  })();

  return (
    <div className="cart-shirt-preview">
      <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
        {shirtPath}
        {/* Design preview overlay */}
        {designPreview && (
          <image href={designPreview} x="33" y="28" width="30" height="30" style={{objectFit:'contain'}} clipPath="url(#shirtClip)"/>
        )}
        {designText && !designPreview && (
          <text x="48" y="52" textAnchor="middle" fontSize="7" fontWeight="bold"
            fill={isDark ? '#ffffff' : '#000000'} fontFamily="sans-serif"
            style={{pointerEvents:'none'}}>
            {designText.length > 8 ? designText.slice(0,8)+'...' : designText}
          </text>
        )}
      </svg>
    </div>
  );
}

export default function CartPage() {
  var { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  var { user } = useAuth();
  var navigate = useNavigate();

  var shipping = cartTotal >= 999 ? 0 : 99;
  var tax = Math.round(cartTotal * 0.18);
  var total = cartTotal + shipping + tax;

  var handleCheckout = function() {
    if (!user) return navigate('/login?redirect=/checkout');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="page flex-center" style={{ minHeight: '70vh' }}>
      <div className="empty-state">
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(function(item) {
              return (
                <div key={item.id} className="cart-item fade-in">
                  {/* Mini shirt preview */}
                  <div className="cart-item-img-wrap">
                    <MiniShirtPreview
                      colorHex={item.colorHex}
                      category={item.category || 'round-neck'}
                      designText={item.customization && item.customization.designText}
                      designPreview={item.customization && item.customization.designPreview}
                    />
                    {/* Color indicator dot */}
                    <span className="cart-item-color" style={{ background: item.colorHex || '#ccc' }} />
                  </div>

                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.productName}</h3>
                    <div className="cart-item-meta">
                      <span className="meta-tag">Size: {item.size}</span>
                      <span className="meta-tag">Color: {item.color}</span>
                      {item.customization && item.customization.printArea && (
                        <span className="meta-tag">Print: {item.customization.printArea}</span>
                      )}
                    </div>

                    {/* Design text preview */}
                    {item.customization && item.customization.designText && (
                      <div className="cart-design-text">
                        ✏️ "{item.customization.designText}"
                      </div>
                    )}

                    {/* Design image preview */}
                    {item.customization && item.customization.designPreview && (
                      <div className="cart-design-image-wrap">
                        <img
                          src={item.customization.designPreview}
                          alt="Your design"
                          className="cart-design-image"
                        />
                        <span className="cart-design-image-label">Your design</span>
                      </div>
                    )}

                    <div className="cart-item-price">&#8377;{item.unitPrice.toFixed(0)} each</div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={function() { updateQuantity(item.id, item.quantity - 1); }}>&#8722;</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={function() { updateQuantity(item.id, item.quantity + 1); }}>+</button>
                    </div>
                    <div className="cart-item-total">&#8377;{(item.unitPrice * item.quantity).toFixed(0)}</div>
                    <button className="remove-btn" onClick={function() { removeFromCart(item.id); }}>&#x2715;</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>&#8377;{cartTotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? <span style={{color:'var(--success)'}}>FREE</span>
                  : '&#8377;' + shipping
                }
              </span>
            </div>
            {shipping > 0 && (
              <div className="free-shipping-hint">
                Add &#8377;{(999 - cartTotal).toFixed(0)} more for free shipping
              </div>
            )}
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>&#8377;{tax}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>&#8377;{total.toFixed(0)}</span>
            </div>
            <button className="btn btn-primary btn-lg checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout &#8594;
            </button>
            <Link to="/products" className="continue-shopping">&#8592; Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}