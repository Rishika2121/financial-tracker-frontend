function showTab(tabId) {

  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });

  // Remove active class from buttons
  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabId).classList.add("active");

  // Activate clicked button
  event.target.classList.add("active");
}
function setRegime(value) {

  document.getElementById("regime").value = value;

  const oldBtn = document.getElementById("oldBtn");
  const newBtn = document.getElementById("newBtn");

  const oldBox = document.getElementById("oldDeductions");
  const newBox = document.getElementById("newDeductions");

  oldBtn.classList.remove("active");
  newBtn.classList.remove("active");
  
  const type = document.getElementById("incomeType").value;
  const isPresumptive = (type === "44AD" || type === "44ADA" || type === "44AE");

  if (value === "old") {

    oldBtn.classList.add("active");

    if (!isPresumptive) {
      oldBox.style.display = "block";
    }
    newBox.style.display = "none";

    enableOldInputs();
    disableNewInputs();

  } else {

    newBtn.classList.add("active");

    oldBox.style.display = "none";
    if (!isPresumptive) {
      newBox.style.display = "block";
    }

    disableOldInputs();
    enableNewInputs();

  }
}

function getValue(id) {
  const val = document.getElementById(id)?.value;
  if (val === "" || val === null || val === undefined) return 0;
  return Number(val);
}
function disableOldInputs() {

  const oldInputs = document
    .getElementById("oldDeductions")
    .querySelectorAll("input");

  oldInputs.forEach(input => {
    input.disabled = true;
    input.value = 0;
  });

}

function enableOldInputs() {

  const oldInputs = document
    .getElementById("oldDeductions")
    .querySelectorAll("input");

  oldInputs.forEach(input => {
    input.disabled = false;
  });

}
function disableNewInputs() {

  const newInputs = document
    .getElementById("newDeductions")
    .querySelectorAll("input");

  newInputs.forEach(input => {
    input.disabled = true;
    input.value = 0;
  });

}

function enableNewInputs() {

  const newInputs = document
    .getElementById("newDeductions")
    .querySelectorAll("input, select");

  newInputs.forEach(input => {
    input.disabled = false;
  });

}
async function calculateTax() {

const regime = document.getElementById("regime")?.value;

const payload = {
  incomeFromSalary: getValue("income"),
  incomeFromInterest: getValue("interestIncome"),
  incomeFromHouseProperty: getValue("rentalIncome"),
  incomeFromOtherSources: getValue("otherIncome"),
 turnover:
  type === "44AD"
    ? getValue("digitalTurnover") + getValue("cashTurnover")
    : getValue("turnover"),
  businessExpenses: getValue("businessExpenses"),
  digitalTurnover: getValue("digitalTurnover"),
  cashTurnover: getValue("cashTurnover"),
  vehicles: getValue("vehicles"),
  regime,
 incomeType: type,
  rent: getValue("rent"),
  salary: getValue("salary"),
  electricity: getValue("electricity"),
  internet: getValue("internet"),
  advertisement: getValue("advertisement"),
  repair: getValue("repair"),
  professionalFees: getValue("professionalFees"),
  loanInterest: getValue("loanInterest"),
  depreciation: getValue("depreciation"),
  otherExpenses: getValue("otherExpenses"),

  selfAge:
    document.getElementById("selfAge")?.value === "60 to 80 Years"
      ? 65
      : document.getElementById("selfAge")?.value === "Above 80 Years"
      ? 85
      : 30,

  deductions: {
    lic: getValue("lic"),
    ppf: getValue("ppf"),
    elss: getValue("elss"),
    homeLoanPrincipal: getValue("homeLoanPrincipal"),
    nps: getValue("nps"),
    nps1b: getValue("nps1b"),
    selfInsurance: getValue("selfInsurance"),
    parentsInsurance: getValue("parentsInsurance"),
    educationLoanInterest: getValue("educationLoanInterest"),
    savingsInterest: getValue("savingsInterest"),
    seniorInterest: getValue("seniorInterest"),
    dependentDisability: document.getElementById("dependentDisability")?.value || "none",
    disabilityType: document.getElementById("disabilityType")?.value || "none",
    donation: getValue("donation"),
    donationType: document.getElementById("donationType")?.value || "none",
    pensionFund: getValue("pensionFund"),
    homeLoanInterest80EE: getValue("homeLoanInterest80EE"),
    affordableHousingInterest: getValue("affordableHousingInterest"),
    rentPaid: getValue("rentPaid"),
    medicalTreatment: getValue("medicalTreatment"),
    
    // NEW REGIME FIELDS
    employerNpsContribution: getValue("employerNpsContribution"),
    leaveEncashment: getValue("leaveEncashment"),
    familyPension: getValue("familyPension"),
    agniveerContribution: getValue("agniveerContribution"),
    additionalEmployeeCost: getValue("additionalEmployeeCost"),
    letOutPropertyInterest: getValue("letOutPropertyInterest"),
    gratuityAmount: getValue("gratuityAmount")
  },

  taxPaid: {
    tds: getValue("tdsPaid"),
    advance: getValue("advanceTax")
  }
};
const type = document.getElementById("incomeType")?.value;

if (type === "44AE") {
  const vehicles = getValue("vehicles");

  if (vehicles > 100) {
    alert("Vehicle number looks incorrect.");
    return;
  }
}
if (type === "44AD") {
  const turnover = getValue("digitalTurnover") + getValue("cashTurnover");

  if (turnover > 30000000) {
    alert("44AD allowed only up to ₹3 Crore turnover");
    return;
  }
}

if (type === "44ADA") {
  const turnover = getValue("turnover");

  if (turnover > 7500000) {
    alert("44ADA allowed only up to ₹75 Lakh receipts");
    return;
  }
}
  try {
   const response = await fetch("https://financial-tracker-backend-jg95.onrender.com/api/tax/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    

    document.getElementById("monthlyTax").innerText =
      "₹" + ((data.totalTax || 0) / 12).toFixed(0);
      document.getElementById("grossIncome").innerText =
  "₹" + (data.grossIncome || 0).toFixed(0);

document.getElementById("totalDeductions").innerText =
  "₹" + (data.totalDeductions || 0).toFixed(0);

if (data.standardDeduction > 0) {
  document.getElementById("stdDeductionVal").innerText = "₹" + data.standardDeduction.toFixed(0);
  document.getElementById("stdDeductionBreakdown").style.display = "flex";
} else {
  document.getElementById("stdDeductionBreakdown").style.display = "none";
}

let dedHtml = "";
if (data.deductionsBreakdown && Object.keys(data.deductionsBreakdown).length > 0) {
  for (const [key, val] of Object.entries(data.deductionsBreakdown)) {
    if (val > 0) {
      let label = key;
      if (key.startsWith("section")) {
        label = key.replace("section", "Section ");
      } else {
        label = key.replace(/([A-Z])/g, ' $1').trim();
        label = label.charAt(0).toUpperCase() + label.slice(1);
      }
      dedHtml += `<div style="display:flex; justify-content:space-between; margin:5px 0; color: #a1a1aa;"><span>${label}</span> <strong style="color:white;">₹${val.toFixed(0)}</strong></div>`;
    }
  }
}
document.getElementById("deductionsBreakdown").innerHTML = dedHtml;

document.getElementById("taxableIncome").innerText =
  "₹" + (data.taxableIncome || 0).toFixed(0);

document.getElementById("taxBeforeCess").innerText =
  "₹" + (data.taxBeforeCess || 0).toFixed(0);

      

   const ratio = data.grossIncome > 0
  ? ((data.totalTax / data.grossIncome) * 100).toFixed(2)
  : 0;

document.getElementById("taxRatio").innerText = ratio + "%";
    document.getElementById("netTax").innerText =
  "₹" + (data.netTaxPayable || 0).toFixed(0);

    document.getElementById("taxPaid").innerText =
  "₹" + (data.taxesPaid || 0).toFixed(0);
  document.getElementById("surcharge").innerText =
  "₹" + (data.surcharge || 0).toFixed(0);

document.getElementById("cess").innerText =
  "₹" + (data.cess || 0).toFixed(0);
  
let breakdownHtml = "";
if (data.breakdown && data.breakdown.length > 0) {
  data.breakdown.forEach(b => {
    breakdownHtml += `<div style="display:flex; justify-content:space-between; margin:5px 0; padding-bottom: 5px; border-bottom: 1px solid #2a344a;"><span>${b.range} (${b.rate})</span> <strong>₹${b.tax.toFixed(0)}</strong></div>`;
  });
  document.getElementById("slabBreakdown").innerHTML = breakdownHtml;
  document.getElementById("slabBreakdownContainer").style.display = "block";
} else {
  document.getElementById("slabBreakdownContainer").style.display = "none";
}
  
  
  } catch (error) {
    alert("Backend not responding");
  }
}
function enableAllDeductions() {

  document.querySelectorAll(".tab").forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1";
    
    
  });

}

function handleIncomeType() {

  const type = document.getElementById("incomeType").value;
  const regime = document.getElementById("regime").value;

  const salaryFieldsWrapper = document.getElementById("salaryFieldsWrapper");
  const businessFieldsWrapper = document.getElementById("businessFieldsWrapper");
  
  const turnoverWrapper = document.getElementById("turnoverWrapper");
  const adWrapper = document.getElementById("adWrapper");
  const aeWrapper = document.getElementById("aeWrapper");
  const booksExpensesWrapper = document.getElementById("booksExpensesWrapper");

  const oldBox = document.getElementById("oldDeductions");
  const newBox = document.getElementById("newDeductions");

  if (type === "NORMAL") {

    salaryFieldsWrapper.style.display = "block";
    businessFieldsWrapper.style.display = "none";

    if (regime === "old") oldBox.style.display = "block";
    if (regime === "new") newBox.style.display = "block";

  } else {

    salaryFieldsWrapper.style.display = "none";
    businessFieldsWrapper.style.display = "block";

    if (type === "BUSINESS") {
      turnoverWrapper.style.display = "block";
      adWrapper.style.display = "none";
      aeWrapper.style.display = "none";
      booksExpensesWrapper.style.display = "block";

      if (regime === "old") oldBox.style.display = "block";
      if (regime === "new") newBox.style.display = "block";
    } else {
      booksExpensesWrapper.style.display = "none";
      
      if (type === "44AD") {
        turnoverWrapper.style.display = "none";
        adWrapper.style.display = "block";
        aeWrapper.style.display = "none";
      } else if (type === "44ADA") {
        turnoverWrapper.style.display = "block";
        adWrapper.style.display = "none";
        aeWrapper.style.display = "none";
      } else if (type === "44AE") {
        turnoverWrapper.style.display = "none";
        adWrapper.style.display = "none";
        aeWrapper.style.display = "block";
      }

      oldBox.style.display = "none";
      newBox.style.display = "none";
    }
  }
}

function disableOldRegimeDeductions() {

  // Disable 80C, 80D, 80G buttons
  document.querySelectorAll(".tab").forEach(btn => {

    if (btn.innerText !== "Others") {
      btn.disabled = true;
      btn.style.opacity = "0.5";
    }
   
  });

}
function toggleTaxPaid(){

  const content = document.getElementById("taxPaidContent");
  const btn = document.getElementById("taxToggleBtn");

  if(content.style.display === "block"){
      content.style.display = "none";
      btn.innerHTML = "+";
  } else {
      content.style.display = "block";
      btn.innerHTML = "−";
  }
}

window.onload = function () {
  setRegime("old");
  handleIncomeType();
};

function downloadReport() {

  const netTax = document.getElementById("netTax")?.innerText || "0";
  const monthlyTax = document.getElementById("monthlyTax")?.innerText || "0";
  const taxRatio = document.getElementById("taxRatio")?.innerText || "0";
  const taxPaid = document.getElementById("taxPaid")?.innerText || "0";

  const report = `
  INCOME TAX REPORT

  Net Tax Payable: ${netTax}
  Monthly Tax: ${monthlyTax}
  Tax Ratio: ${taxRatio}
  Taxes Paid: ${taxPaid}

  Generated on: ${new Date().toLocaleDateString()}
  `;

  const blob = new Blob([report], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Tax_Report.txt";

  link.click();
}