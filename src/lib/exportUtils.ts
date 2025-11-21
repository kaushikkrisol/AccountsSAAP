import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

// Helper function to format Indian currency
const formatIndianCurrency = (num: number): string => {
  return 'Rs. ' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to format numbers without quotes
const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to convert number to words (Indian format)
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };
  
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remainder > 0) result += convertLessThanThousand(remainder);
  
  return result.trim();
};

// PDF Export Functions
export const exportInvoiceToPDF = (invoice: any) => {
  const doc = new jsPDF();
  
  // Set default font to Times for professional look
  doc.setFont('times', 'normal');
  
  let yPos = 12;
  
  // Border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, 200, 287);
  
  // ===== HEADER SECTION =====
  // "ORIGINAL FOR RECIPIENT" on top right
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIGINAL FOR RECIPIENT', 205, yPos, { align: 'right' });
  
  yPos += 8;
  
  // Logo placeholder (left), TAX INVOICE (center), QR code placeholder (right)
  doc.setFillColor(200, 200, 200);
  doc.rect(10, yPos, 30, 25, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('Logo', 25, yPos + 15, { align: 'center' });
  
  // TAX INVOICE - center
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 105, yPos + 5, { align: 'center' });
  
  // Company details below TAX INVOICE
  doc.setFontSize(10);
  doc.text(invoice.companyName || '3MXYZ', 105, yPos + 12, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Registered Office:', 105, yPos + 17, { align: 'center' });
  doc.text('Tel-No:', 105, yPos + 21, { align: 'center' });
  doc.text('CIN:', 105, yPos + 25, { align: 'center' });
  
  // QR code placeholder (right)
  doc.setFillColor(0, 0, 0);
  doc.rect(175, yPos, 25, 25, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text('QR', 187.5, yPos + 13, { align: 'center' });
  
  yPos += 28;
  
  // Full address
  doc.setFontSize(7);
  doc.text(invoice.companyAddress || '3MXYZ,CFVGB,KARNATAKA,KARNATAKA,560023', 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Tel-No:', 105, yPos, { align: 'center' });
  yPos += 6;
  
  // GSTIN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`GSTIN: ${invoice.gstin || 'ZZZZZZZZZZZZZZZ00'}`, 105, yPos, { align: 'center' });
  yPos += 4;
  
  // IRN
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('IRN:', 105, yPos, { align: 'center' });
  yPos += 3;
  doc.text(invoice.irn || 'def8077c6256c7742085a71875aad0d79207b2e260581875307d2cd519a7e57f', 105, yPos, { align: 'center' });
  
  yPos += 6;
  
  // ===== INVOICE DETAILS GRID =====
  const gridStartY = yPos;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(5, yPos, 200, 20);
  doc.line(105, yPos, 105, yPos + 20);
  doc.line(5, yPos + 5, 205, yPos + 5);
  doc.line(5, yPos + 10, 205, yPos + 10);
  doc.line(5, yPos + 15, 205, yPos + 15);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  // Left column
  doc.text('Tax is Payable on Reverse Charge:', 8, yPos + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.text('No', 100, yPos + 3.5, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Serial Number:', 8, yPos + 8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.invoiceNumber || '234694KF48', 100, yPos + 8.5, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Date:', 8, yPos + 13.5);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.date || '02-07-2020', 100, yPos + 13.5, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Currency Code:', 8, yPos + 18.5);
  doc.setFont('helvetica', 'bold');
  doc.text('INR', 100, yPos + 18.5, { align: 'right' });
  
  // Right column
  doc.setFont('helvetica', 'normal');
  doc.text('Transportation Mode:', 108, yPos + 3.5);
  
  doc.text('Veh. No:', 108, yPos + 8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.vehicleNo || '', 200, yPos + 8.5, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('Date & Time of Supply:', 108, yPos + 13.5);
  
  doc.text('Place of Supply:', 108, yPos + 18.5);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.placeOfSupply || 'Karnataka', 200, yPos + 18.5, { align: 'right' });
  
  yPos += 22;
  
  // ===== PARTY DETAILS =====
  doc.setDrawColor(0, 0, 0);
  doc.rect(5, yPos, 100, 5);
  doc.rect(105, yPos, 100, 5);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Details of Customer (Bill to)', 8, yPos + 3.5);
  doc.text('Details of Consignee (Ship to)', 108, yPos + 3.5);
  
  yPos += 5;
  
  // Customer details box
  doc.rect(5, yPos, 100, 25);
  doc.rect(105, yPos, 100, 25);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  
  // Bill to
  doc.text(`Name:`, 8, yPos + 4);
  doc.setFont('times', 'bold');
  doc.text(invoice.customerName || 'ABC Trading Co.', 100, yPos + 4, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`Address:`, 8, yPos + 8);
  doc.setFont('times', 'bold');
  doc.text(invoice.customerAddress || '123 Business Street, Mumbai', 100, yPos + 8, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`State Name:`, 8, yPos + 12);
  doc.setFont('times', 'bold');
  doc.text(invoice.customerState || 'Maharashtra', 100, yPos + 12, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`State Code:`, 8, yPos + 16);
  doc.setFont('times', 'bold');
  doc.text(invoice.customerStateCode || '07', 100, yPos + 16, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`GSTIN:`, 8, yPos + 20);
  doc.setFont('times', 'bold');
  doc.text(invoice.customerGST || '27AAAAA0000A1Z5', 100, yPos + 20, { align: 'right' });
  
  // Ship to
  doc.setFont('times', 'normal');
  doc.text(`Name:`, 108, yPos + 4);
  doc.setFont('times', 'bold');
  doc.text(invoice.consigneeName || 'leg name15', 200, yPos + 4, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`Address:`, 108, yPos + 8);
  doc.setFont('times', 'bold');
  doc.text(invoice.consigneeAddress || 'amr tech park', 200, yPos + 8, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`State Name:`, 108, yPos + 12);
  doc.setFont('times', 'bold');
  doc.text(invoice.consigneeState || 'KARNATAKA', 200, yPos + 12, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`State Code:`, 108, yPos + 16);
  doc.setFont('times', 'bold');
  doc.text(invoice.consigneeStateCode || '29', 200, yPos + 16, { align: 'right' });
  
  doc.setFont('times', 'normal');
  doc.text(`GSTIN:`, 108, yPos + 20);
  doc.setFont('times', 'bold');
  doc.text(invoice.consigneeGST || '29XXXXXXXXXXXZW', 200, yPos + 20, { align: 'right' });
  
  yPos += 27;
  
  // ===== ITEMS TABLE =====
  // Generate 15 line items for the invoice
  const dummyItems = Array.from({ length: 15 }, (_, i) => ({
    description: `Product ${String.fromCharCode(65 + i)}`,
    hsnCode: '9401',
    quantity: 10.00,
    unit: 'NOS',
    rate: 1000.00,
    total: 10000.00,
    discount: 0.00,
    taxableValue: 10000.00,
    cgstRate: 9.00,
    cgstAmount: 900.00,
    sgstRate: 9.00,
    sgstAmount: 900.00,
    igstRate: 0.00,
    igstAmount: 0.00
  }));
  
  const itemsToUse = invoice.items && invoice.items.length > 0 ? invoice.items : dummyItems;
  
  const tableData = itemsToUse.map((item: any, index: number) => {
    const qty = item.quantity ?? 0;
    const rate = item.rate ?? 0;
    const total = item.total ?? (qty * rate);
    const discount = item.discount ?? 0;
    const taxableValue = item.taxableValue ?? (total - discount);
    const cgstRate = item.cgstRate ?? (item.gstRate ? item.gstRate / 2 : 0);
    const sgstRate = item.sgstRate ?? (item.gstRate ? item.gstRate / 2 : 0);
    const igstRate = item.igstRate ?? 0;
    const cgstAmt = item.cgstAmount ?? (taxableValue * cgstRate / 100);
    const sgstAmt = item.sgstAmount ?? (taxableValue * sgstRate / 100);
    const igstAmt = item.igstAmount ?? 0;
    const totalWithGst = taxableValue + cgstAmt + sgstAmt + igstAmt;
    
    return [
      (index + 1).toString(),
      item.description || '',
      item.hsnCode || '9401',
      formatNumber(qty, 2),
      item.unit || 'NOS',
      formatNumber(rate, 2),
      formatNumber(total, 2),
      formatNumber(discount, 2),
      formatNumber(taxableValue, 2),
      cgstRate > 0 ? formatNumber(cgstRate, 2) + '%' : '',
      formatNumber(cgstAmt, 2),
      sgstRate > 0 ? formatNumber(sgstRate, 2) + '%' : '',
      formatNumber(sgstAmt, 2),
      igstRate > 0 ? formatNumber(igstRate, 2) + '%' : '',
      formatNumber(igstAmt, 2),
      formatNumber(totalWithGst, 2)
    ];
  });
  
  doc.autoTable({
    head: [['S.\nNo', 'Description of\nGoods', 'HSN Code\n(GST)', 'QTY', 'UOM', 'Rate', 'Total', 'Disc', 'Taxable\nValue', 'CGST\nRate', 'CGST\nAmount', 'SGST\nRate', 'SGST\nAmount', 'IGST\nRate', 'IGST\nAmount', 'Total']],
    body: tableData,
    startY: yPos,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 6,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fontSize: 6,
      halign: 'right',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 30, halign: 'left' },
      2: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 10, halign: 'right' },
      4: { cellWidth: 9, halign: 'center' },
      5: { cellWidth: 12, halign: 'right' },
      6: { cellWidth: 12, halign: 'right' },
      7: { cellWidth: 10, halign: 'right' },
      8: { cellWidth: 13, halign: 'right' },
      9: { cellWidth: 10, halign: 'center' },
      10: { cellWidth: 12, halign: 'right' },
      11: { cellWidth: 10, halign: 'center' },
      12: { cellWidth: 12, halign: 'right' },
      13: { cellWidth: 10, halign: 'center' },
      14: { cellWidth: 12, halign: 'right' },
      15: { cellWidth: 13, halign: 'right' }
    },
    margin: { left: 5, right: 5 }
  });
  
  // ===== LINE ITEM TOTALS & SUMMARY =====
  let finalY = doc.lastAutoTable.finalY + 2;
  
  // Calculate totals
  const itemsToCalc = invoice.items && invoice.items.length > 0 ? invoice.items : dummyItems;
  
  const lineTotal = itemsToCalc.reduce((sum: number, item: any) => {
    const qty = item.quantity ?? 0;
    const rate = item.rate ?? 0;
    return sum + (qty * rate);
  }, 0);
  
  const totalQty = itemsToCalc.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const subtotal = itemsToCalc.reduce((sum: number, item: any) => sum + (item.taxableValue || 0), 0);
  const totalCGST = itemsToCalc.reduce((sum: number, item: any) => sum + (item.cgstAmount || 0), 0);
  const totalSGST = itemsToCalc.reduce((sum: number, item: any) => sum + (item.sgstAmount || 0), 0);
  const totalIGST = itemsToCalc.reduce((sum: number, item: any) => sum + (item.igstAmount || 0), 0);
  
  // Add line item totals row
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(5, finalY, 200, 6);
  
  doc.setFontSize(6);
  doc.setFont('times', 'bold');
  doc.text('Line Total:', 8, finalY + 4);
  doc.text(formatNumber(lineTotal, 2), 200, finalY + 4, { align: 'right' });
  
  finalY += 6;
  
  // Invoice Value in Words (left side)
  doc.rect(5, finalY, 100, 15);
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.text('Invoice Value (In Words)', 8, finalY + 4);
  
  doc.setFontSize(6);
  doc.setFont('times', 'normal');
  const grandTotal = subtotal + totalCGST + totalSGST + totalIGST;
  const amountInWords = numberToWords(Math.floor(grandTotal));
  doc.text(amountInWords + ' Rupees Only', 8, finalY + 9, { maxWidth: 95 });
  
  // Right side - Total and Invoice Total
  const chargesStartY = finalY;
  doc.rect(105, finalY, 100, 6);
  doc.setFontSize(6);
  doc.setFont('times', 'normal');
  doc.text('Total', 108, finalY + 4);
  doc.setFont('times', 'bold');
  doc.text(formatIndianCurrency(grandTotal), 200, finalY + 4, { align: 'right' });
  
  finalY += 6;
  
  // Invoice Total
  doc.rect(105, finalY, 100, 9);
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.text('Invoice Total', 108, finalY + 6);
  doc.text(formatIndianCurrency(grandTotal), 200, finalY + 6, { align: 'right' });
  
  finalY += 9;
  
  // ===== ORDER REFERENCE =====
  doc.rect(5, finalY, 200, 6);
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.text('Order Reference:', 8, finalY + 4);
  
  finalY += 6;
  
  // ===== TERMS AND FOOTER =====
  doc.rect(5, finalY, 100, 20);
  doc.rect(105, finalY, 100, 20);
  
  doc.setFontSize(8);
  doc.setFont('times', 'bold');
  doc.text('Terms & Conditions of sale', 8, finalY + 4);
  
  doc.setFontSize(6);
  doc.setFont('times', 'normal');
  doc.text('***Overleaf or the next page***', 8, finalY + 12);
  
  // Right side - Company name and signature
  doc.setFontSize(8);
  doc.setFont('times', 'bold');
  doc.text(invoice.companyName || '3MXYZ', 108, finalY + 4);
  
  doc.setFontSize(7);
  doc.text('Authorized Signatory:', 108, finalY + 10);
  
  // Signature line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(145, finalY + 17, 200, finalY + 17);
  
  doc.save(`Tax-Invoice-${invoice.invoiceNumber || 'INV'}.pdf`);
};

export const exportReceiptToPDF = (receipt: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('RECEIPT', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Receipt Number: ${receipt.receiptNumber}`, 20, 40);
  doc.text(`Date: ${receipt.date}`, 20, 50);
  doc.text(`Customer: ${receipt.customerName}`, 20, 60);
  doc.text(`Amount: ₹${receipt.amount.toFixed(2)}`, 20, 70);
  doc.text(`Payment Mode: ${receipt.paymentMode}`, 20, 80);
  
  if (receipt.paymentMode === 'Bank' || receipt.paymentMode === 'Cheque') {
    doc.text(`Bank Name: ${receipt.bankAccount || 'N/A'}`, 20, 90);
    doc.text(`Reference: ${receipt.referenceNumber || 'N/A'}`, 20, 100);
  }
  
  doc.save(`receipt-${receipt.receiptNumber}.pdf`);
};

export const exportPaymentToPDF = (payment: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('PAYMENT VOUCHER', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Payment Number: ${payment.paymentNumber}`, 20, 40);
  doc.text(`Date: ${payment.date}`, 20, 50);
  doc.text(`Vendor: ${payment.vendorName}`, 20, 60);
  doc.text(`Amount: ₹${payment.amount.toFixed(2)}`, 20, 70);
  doc.text(`Payment Mode: ${payment.paymentMode}`, 20, 80);
  
  if (payment.paymentMode === 'Bank' || payment.paymentMode === 'Cheque') {
    doc.text(`Bank Name: ${payment.bankAccount || 'N/A'}`, 20, 90);
    doc.text(`Reference: ${payment.referenceNumber || 'N/A'}`, 20, 100);
  }
  
  doc.save(`payment-${payment.paymentNumber}.pdf`);
};

export const exportJournalToPDF = (entry: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('JOURNAL ENTRY', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Entry Number: ${entry.entryNumber}`, 20, 40);
  doc.text(`Date: ${entry.date}`, 20, 50);
  doc.text(`Reference: ${entry.reference}`, 20, 60);
  doc.text(`Narration: ${entry.narration}`, 20, 70);
  
  const tableData = (entry.entries || []).map((line: any) => [
    line.accountName,
    line.narration,
    (line.debitAmount || 0) > 0 ? `₹${(line.debitAmount || 0).toFixed(2)}` : '',
    (line.creditAmount || 0) > 0 ? `₹${(line.creditAmount || 0).toFixed(2)}` : ''
  ]);
  
  doc.autoTable({
    head: [['Account', 'Narration', 'Debit', 'Credit']],
    body: tableData,
    startY: 80,
    theme: 'grid'
  });
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Debit: ₹${entry.totalDebit.toFixed(2)}`, 120, finalY);
  doc.text(`Total Credit: ₹${entry.totalCredit.toFixed(2)}`, 120, finalY + 10);
  
  doc.save(`journal-${entry.entryNumber}.pdf`);
};

export const exportCreditNoteToPDF = (creditNote: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('CREDIT NOTE', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Credit Note Number: ${creditNote.creditNoteNumber}`, 20, 40);
  doc.text(`Date: ${creditNote.date}`, 20, 50);
  doc.text(`Customer: ${creditNote.customerName}`, 20, 60);
  doc.text(`Original Invoice: ${creditNote.originalInvoiceNumber}`, 20, 70);
  doc.text(`Reason: ${creditNote.reason}`, 20, 80);
  
  const tableData = creditNote.items.map((item: any) => [
    item.description,
    item.quantity.toString(),
    `₹${item.rate.toFixed(2)}`,
    `₹${item.amount.toFixed(2)}`,
    `₹${item.gstAmount.toFixed(2)}`,
    `₹${item.total.toFixed(2)}`
  ]);
  
  doc.autoTable({
    head: [['Description', 'Qty', 'Rate', 'Amount', 'GST', 'Total']],
    body: tableData,
    startY: 90,
    theme: 'grid'
  });
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: ₹${creditNote.subtotal.toFixed(2)}`, 120, finalY);
  doc.text(`Total GST: ₹${creditNote.totalGST.toFixed(2)}`, 120, finalY + 10);
  doc.text(`Total: ₹${creditNote.total.toFixed(2)}`, 120, finalY + 20);
  
  doc.save(`credit-note-${creditNote.creditNoteNumber}.pdf`);
};

// Excel Export Functions
export const exportInvoicesToExcel = (invoices: any[]) => {
  const data = invoices.map(invoice => ({
    'Invoice Number': invoice.invoiceNumber,
    'Date': invoice.date,
    'Customer': invoice.customerName,
    'Subtotal': invoice.subtotal,
    'Total GST': (invoice.totalCGST || 0) + (invoice.totalSGST || 0) + (invoice.totalIGST || 0),
    'Total Amount': invoice.totalAmount,
    'Status': invoice.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Invoices');
  XLSX.writeFile(wb, 'sales-invoices.xlsx');
};

export const exportReceiptsToExcel = (receipts: any[]) => {
  const data = receipts.map(receipt => ({
    'Receipt Number': receipt.receiptNumber,
    'Date': receipt.date,
    'Customer': receipt.customerName,
    'Amount': receipt.amount,
    'Payment Mode': receipt.paymentMode,
    'Bank Name': receipt.bankAccount || '',
    'Reference': receipt.referenceNumber || '',
    'Status': receipt.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Receipts');
  XLSX.writeFile(wb, 'receipts.xlsx');
};

export const exportPaymentsToExcel = (payments: any[]) => {
  const data = payments.map(payment => ({
    'Payment Number': payment.paymentNumber,
    'Date': payment.date,
    'Vendor': payment.vendorName,
    'Amount': payment.amount,
    'Payment Mode': payment.paymentMode,
    'Bank Name': payment.bankAccount || '',
    'Reference': payment.referenceNumber || '',
    'Status': payment.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payments');
  XLSX.writeFile(wb, 'payments.xlsx');
};

export const exportJournalToExcel = (entries: any[]) => {
  const data = entries.map(entry => ({
    'Entry Number': entry.entryNumber,
    'Date': entry.date,
    'Reference': entry.reference,
    'Narration': entry.narration,
    'Total Debit': entry.totalDebit,
    'Total Credit': entry.totalCredit,
    'Status': entry.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Journal Entries');
  XLSX.writeFile(wb, 'journal-entries.xlsx');
};

export const exportCreditNotesToExcel = (creditNotes: any[]) => {
  const data = creditNotes.map(creditNote => ({
    'Credit Note Number': creditNote.creditNoteNumber,
    'Date': creditNote.date,
    'Customer': creditNote.customerName,
    'Original Invoice': creditNote.originalInvoiceNumber,
    'Reason': creditNote.reason,
    'Subtotal': creditNote.subtotal,
    'Total GST': creditNote.totalGST,
    'Total Amount': creditNote.total,
    'Status': creditNote.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Credit Notes');
  XLSX.writeFile(wb, 'credit-notes.xlsx');
};

export const exportPurchaseVoucherToPDF = (voucher: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('PURCHASE VOUCHER', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Voucher No: ${voucher.voucherNo}`, 20, 40);
  doc.text(`Date: ${voucher.date}`, 20, 50);
  doc.text(`Supplier: ${voucher.supplier}`, 20, 60);
  doc.text(`Supplier State: ${voucher.supplierState}`, 20, 70);
  
  const tableData = (voucher.items || []).map((item: any, index: number) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    formatIndianCurrency(item.rate),
    formatIndianCurrency(item.amount),
    `${item.gstRate}%`,
    formatIndianCurrency(item.cgst),
    formatIndianCurrency(item.sgst),
    formatIndianCurrency(item.igst),
    formatIndianCurrency(item.totalAmount)
  ]);
  
  doc.autoTable({
    startY: 80,
    head: [['S.No', 'Description', 'Qty', 'Rate', 'Amount', 'GST%', 'CGST', 'SGST', 'IGST', 'Total']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Subtotal: ${formatIndianCurrency(voucher.subtotal)}`, 20, finalY + 10);
  doc.text(`Total CGST: ${formatIndianCurrency(voucher.totalCgst)}`, 20, finalY + 20);
  doc.text(`Total SGST: ${formatIndianCurrency(voucher.totalSgst)}`, 20, finalY + 30);
  doc.text(`Total IGST: ${formatIndianCurrency(voucher.totalIgst)}`, 20, finalY + 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatIndianCurrency(voucher.grandTotal)}`, 20, finalY + 55);
  
  doc.save(`Purchase_Voucher_${voucher.voucherNo}.pdf`);
};

export const exportPurchaseVouchersToExcel = (vouchers: any[]) => {
  const data = vouchers.map(voucher => ({
    'Voucher No': voucher.voucherNo,
    'Date': voucher.date,
    'Supplier': voucher.supplier,
    'Supplier State': voucher.supplierState,
    'Subtotal': voucher.subtotal,
    'Total CGST': voucher.totalCgst,
    'Total SGST': voucher.totalSgst,
    'Total IGST': voucher.totalIgst,
    'Grand Total': voucher.grandTotal,
    'Status': voucher.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Vouchers');
  XLSX.writeFile(wb, 'purchase-vouchers.xlsx');
};