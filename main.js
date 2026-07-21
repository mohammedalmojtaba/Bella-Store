// ==========================================
// ⚙️ CONFIGURATION: CHANGE THE EXCHANGE RATE HERE
// ==========================================
const EXCHANGE_RATE = 1550; // 1 SAR = 1600 SDG
// ==========================================

const WHATSAPP_NUMBER = "249906044424"; // Your WhatsApp number

// 📖 Translation Dictionary
const translations = {
  en: {
    title: "Bella Store",
    subtitle: "Your International Shopping Agent in Sudan",
    labelLink: "Paste Product Link (Shein, Amazon, Alibaba, or Trendyol)",
    placeholderLink: "https://...",
    errorLink: "Please paste a valid link from a supported store.",
    labelPrice: "Product Price in Saudi Riyal (SAR)",
    placeholderPrice: "e.g., 200",
    btnCalculate: "Calculate SDG Price",
    resultLabel: "Estimated Total Price (SDG)",
    warningNote: "⚠️ <strong>Note:</strong> This price represents the product cost only. It does <strong>not</strong> include international shipping or local delivery fees.",
    btnWhatsapp: "Proceed to Order (WhatsApp)",
    alertPrice: "Please enter a valid price in Saudi Riyal.",
    langBtn: "العربية",
    // WhatsApp template components
    waHello: "Hello Bella Store! I would like to place an order.",
    waLink: "Product Link",
    waPrice: "Product Price",
    waCalc: "Calculated SDG"
  },
  ar: {
    title: "متجر بيلا",
    subtitle: "وكيلك للتسوق الدولي في السودان",
    labelLink: "انسخ رابط المنتج (شي إن، أمازون، علي بابا، أو ترينديول)", // ✨ تم التحديث هنا بنجاح!
    placeholderLink: "https://...",
    errorLink: "الرجاء إدخال رابط صحيح من المواقع المدعومة.",
    labelPrice: "سعر المنتج بالريال السعودي (SAR)",
    placeholderPrice: "مثال: 200",
    btnCalculate: "احسب السعر بالجنيه السوداني",
    resultLabel: "السعر الإجمالي التقريبي (بالجنيه السوداني)",
    warningNote: "⚠️ <strong>ملاحظة:</strong> هذا السعر يشمل قيمة المنتج فقط. ولا يشمل تكاليف الشحن الدولي أو التوصيل المحلي.",
    btnWhatsapp: "تأكيد والطلب عبر واتساب",
    alertPrice: "الرجاء إدخال سعر صحيح بالريال السعودي.",
    langBtn: "English",
    // WhatsApp template components
    waHello: "مرحباً متجر بيلا! أود تقديم طلب شراء.",
    waLink: "رابط المنتج",
    waPrice: "سعر المنتج",
    waCalc: "المبلغ المحسوب بالجنيه"
  }
};

// State tracker (Default language)
let currentLang = 'en';

// DOM Selectors
const langToggleBtn = document.getElementById('lang-toggle-btn');
const appTitle = document.getElementById('app-title');
const appSubtitle = document.getElementById('app-subtitle');
const labelLink = document.getElementById('label-link');
const productLinkInput = document.getElementById('product-link');
const linkError = document.getElementById('link-error');
const labelPrice = document.getElementById('label-price');
const sarPriceInput = document.getElementById('sar-price');
const calculateBtn = document.getElementById('calculate-btn');
const resultCard = document.getElementById('result-card');
const resultLabel = document.getElementById('result-label');
const sdgTotalDisplay = document.getElementById('sdg-total');
const warningNote = document.getElementById('warning-note');
const whatsappBtn = document.getElementById('whatsapp-btn');

let calculatedSdgPrice = 0;

// 🔄 Language Changer Function
function setLanguage(lang) {
  currentLang = lang;
  const trans = translations[lang];

  // Set the direction of the webpage (RTL for Arabic, LTR for English)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Swap all text
  langToggleBtn.textContent = trans.langBtn;
  appTitle.textContent = trans.title;
  appSubtitle.textContent = trans.subtitle;
  labelLink.textContent = trans.labelLink;
  productLinkInput.placeholder = trans.placeholderLink;
  linkError.textContent = trans.errorLink;
  labelPrice.textContent = trans.labelPrice;
  sarPriceInput.placeholder = trans.placeholderPrice;
  calculateBtn.textContent = trans.btnCalculate;
  resultLabel.textContent = trans.resultLabel;
  warningNote.innerHTML = trans.warningNote;
  whatsappBtn.textContent = trans.btnWhatsapp;
}

// Event listener for Language Toggle Button
langToggleBtn.addEventListener('click', () => {
  const nextLang = currentLang === 'en' ? 'ar' : 'en';
  setLanguage(nextLang);
});

// App link validation
function isValidStoreLink(url) {
  const lowercaseUrl = url.toLowerCase();
  
  const isShein = lowercaseUrl.includes('shein');
  const isAmazon = lowercaseUrl.includes('amazon') || 
                    lowercaseUrl.includes('amzn') || 
                    lowercaseUrl.includes('a.co');
  const isAlibaba = lowercaseUrl.includes('alibaba');
  const isTrendyol = lowercaseUrl.includes('trendyol') || 
                     lowercaseUrl.includes('ty.gl');

  return (isShein || isAmazon || isAlibaba || isTrendyol);
}

// Price calculation
calculateBtn.addEventListener('click', () => {
  const url = productLinkInput.value.trim();
  const sarPrice = parseFloat(sarPriceInput.value);

  // Validate Link
  if (!url || !isValidStoreLink(url)) {
    linkError.style.display = 'block';
    resultCard.style.display = 'none';
    return;
  } else {
    linkError.style.display = 'none';
  }

  // Validate Price
  if (isNaN(sarPrice) || sarPrice <= 0) {
    alert(translations[currentLang].alertPrice);
    return;
  }

  // Calculate Exchange
  calculatedSdgPrice = Math.round(sarPrice * EXCHANGE_RATE);

  // Output formatting
  sdgTotalDisplay.textContent = `${calculatedSdgPrice.toLocaleString()} SDG`;
  resultCard.style.display = 'block';
});

// Redirect with formatted order template on WhatsApp
whatsappBtn.addEventListener('click', () => {
  const url = productLinkInput.value.trim();
  const sarPrice = parseFloat(sarPriceInput.value);
  const trans = translations[currentLang];

  // Dynamically translate the WhatsApp layout
  const message = `${trans.waHello}

*${trans.waLink}:* ${url}
*${trans.waPrice}:* ${sarPrice} SAR
*${trans.waCalc}:* ${calculatedSdgPrice.toLocaleString()} SDG`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
});

// Set default language on load
setLanguage('en');
