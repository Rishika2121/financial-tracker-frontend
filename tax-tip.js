// ===============================
// SHUNYATAX AUTO ROTATING TAX TIPS
// ===============================

// ALL TAX TIPS
const taxTips = [

"Save ₹1,50,000 under Section 80C (LIC, PPF, FD, Tuition Fee).",

"Get ₹2,00,000 Home Loan Interest deduction under Section 24(b).",

"Health Insurance gives up to ₹1,00,000 deduction under 80D.",

"Extra ₹50,000 deduction available via NPS under 80CCD(1B).",

"Claim Rent deduction under 80GG if no HRA received.",

"Education Loan Interest is fully deductible under 80E.",

"Senior citizens get ₹50,000 deduction under 80TTB.",

"Donations can give 50% to 100% deduction under 80G.",

"NIL Tax possible up to ₹12.75 lakh under New Regime.",

"Investments in ELSS, FD, LIC help reduce taxable income."

];

let currentTipIndex = 0;


// LOAD COMPONENT ON EVERY PAGE
fetch("tax-tip.html")
.then(res => res.text())
.then(data => {

    document.body.insertAdjacentHTML("beforeend", data);

    const tipText = document.getElementById("taxTipText");
    const tipBox = document.getElementById("taxTipFloat");


    // FUNCTION TO CHANGE TIP
    function showNextTip()
    {
        tipText.innerText = taxTips[currentTipIndex];

        tipBox.classList.add("show-tip");

        setTimeout(() =>
        {
            tipBox.classList.remove("show-tip");
        }, 2500);


        currentTipIndex++;

        if(currentTipIndex >= taxTips.length)
            currentTipIndex = 0;
    }


    // FIRST TIP IMMEDIATELY
    showNextTip();

    // AUTO CHANGE EVERY 3 SECONDS
    setInterval(showNextTip, 3000);

});
