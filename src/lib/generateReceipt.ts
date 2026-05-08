import { jsPDF } from "jspdf";

export interface ReceiptData {
  orderId: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shipping?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  status?: string;
}

export function generateReceipt(data: ReceiptData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = 30;

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("threadly.one", pageWidth / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("CUSTOM EMBROIDERED ACCESSORIES", pageWidth / 2, y, { align: "center" });
  y += 12;

  // Divider
  doc.setDrawColor(230);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Order Info
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("ORDER ID", margin, y);
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.setFont("courier", "bold");
  doc.text(data.orderId, pageWidth - margin, y, { align: "right" });
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("DATE", margin, y);
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(data.date, pageWidth - margin, y, { align: "right" });
  y += 7;

  if (data.status) {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("STATUS", margin, y);
    doc.setFontSize(10);
    doc.setTextColor(139, 125, 60);
    doc.text(data.status.toUpperCase(), pageWidth - margin, y, { align: "right" });
    y += 7;
  }

  y += 5;
  doc.setDrawColor(230);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Items header
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("PRODUCT", margin, y);
  doc.text("QTY", margin + contentWidth * 0.65, y, { align: "center" });
  doc.text("AMOUNT", pageWidth - margin, y, { align: "right" });
  y += 3;
  doc.setDrawColor(240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Items
  doc.setTextColor(50);
  doc.setFontSize(10);
  data.items.forEach((item) => {
    const itemName = item.name.length > 40 ? item.name.substring(0, 37) + "..." : item.name;
    doc.text(itemName, margin, y);
    doc.text(String(item.quantity), margin + contentWidth * 0.65, y, { align: "center" });
    const amount = `Rs.${(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    doc.text(amount, pageWidth - margin, y, { align: "right" });
    y += 4;
    doc.setDrawColor(245);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  });

  y += 3;

  // Total box
  doc.setFillColor(249, 247, 243);
  doc.roundedRect(margin, y - 2, contentWidth, 14, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("TOTAL", margin + 6, y + 7);
  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  const totalStr = `Rs.${data.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  doc.text(totalStr, pageWidth - margin - 6, y + 8, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 20;

  // Shipping
  if (data.shipping) {
    y += 5;
    doc.setDrawColor(230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("SHIPPING TO", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(data.shipping.name, margin, y);
    y += 5;
    doc.text(`+91 ${data.shipping.phone}`, margin, y);
    y += 5;
    doc.text(data.shipping.address, margin, y);
    y += 5;
    doc.text(`${data.shipping.city} - ${data.shipping.pincode}`, margin, y);
    y += 10;
  }

  // Footer
  y += 5;
  doc.setDrawColor(230);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text("Thank you for your order!", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(170);
  doc.text("threadly.one | threadly.one@gmail.com", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text("+91 8073967470 | +91 7619377577", pageWidth / 2, y, { align: "center" });

  doc.save(`receipt-${data.orderId}.pdf`);
}
