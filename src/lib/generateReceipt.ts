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

const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACFCAYAAAAenrcsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAADIoAMABAAAAAEAAACFAAAAADs4oW0AAAHNaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNTM2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEwMjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K2JOjDgAAFi9JREFUeAHtnWmQHdV1x3t57828WZnRjPZ9wwjJErssIATZLAZXJbFCbEzASxwgJDE2BhJS5ZgUfLCrYjt2bFf4gGPKlbgoG8ckJFUsNgaJRVgLyEgCCyQkgcRII41mn7d0d37/ntfwZjSDhDRCmplzq867t8899/bt/zvn7n3bccwZAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGwKhEwKXU3qgs+SgttD9Kyz0ei12XTqfP8jxvZhiG7QCQG48g2DMbAkMhkPJ9/y9dz1uPgWwl/CdDCRlv5BGw5nrkMR3xHCsqKubSavwT/avnoijKO5HziRG/iWU4JAJmIEPC8oEwhX0FVFWiDP6QXd5CoXAtcd3V1dVfxy+4jtuKb+4DQCD1AdzDbvEuAjKCZmhCKpVqojU4jXBFEAQR3aaeIHC7HKfYAa8H6oQUDpBb5bv+/fl8fonr+Skv9ffFsEjQ3IlGwAzkRCPcn79wnokRLHFd96IoiM7EKOoYT9BzCvO+60rbPd+P6EX5BcKHkHsrdN3XXOKRmc3c1fO0JLc4nre5r9i3ARkZm9KFkLkThICmDc2dWATqaS3OC8PoOseJltIa7EX5n4c2YDA7oXbCRQymBkOoIzy9WAwXoPcLCM+Et4TiZRmgPxqF4fnMZKmbJfkeNwjasRBaHacbOggdgMxgAGGknBnISCE5dD4NtBLXYhQ3Er0z7aX/vbqu+sm2tjZN0x7RMeaY1NPT8wR5tMtQMJj74d3X29v7z+RZRwZR6IR5z/H2u1G0pRh6v8F2XoIvozFnCJzSCGRQ7C+h1Lvx76mrq2s8htLOJn2bl0ptxN/KbNY85VFTU9NOS7KM1ufj0I3k/w3iH2ecspbr6xFJH8O9LIkh8MEhQLdqBUq7z/NS915zzTVDzk4dqTQoO90yJnUhjOBb7yWv1gaZb7uutwfjWfpeshZnCJxsBHyU9UEMZH1jY6O6QsfiGHZ4PyahDORgJpP58JEyaWhoqOeeu0h375FkLd4QOGkIVDvVk1HUNhT1r4+jEA3ksY30kev6D+EfVStEq/MrZH96HPe1pGUI2EJhGRgjFcylcnPJqwZlXXOsedJFO5uB+BzS5zKZ1AP4wVHkVRFG4QQMU7NZ5kYAAc3Pmxt5BGrIMsRAOlm7OJrcVVFNgpoYP1QWnEIYBuEfcc0Sifu72lztk7mj2JuocQ/Tv/Ncz73naG5qMkdGwAzkyBi9bwmU+hCJvGKxOBN/+xEyaECxl4Shc2UUBYuYzq1hK0mB1uMcpWPQva01ap1FcB+kfPPQYKftKgsxjq/ReqxlxuwJppIHy9j1MSBwVP3aY8h3XCdhGraXbSGfAoRKFP1J/KGaEVVOc1DoT2EUX2WoMYFp2mcd13nCi5yeMIquJl6Lf30Y3AXITYPqya8aXj2kbSoToFm0VH+IfzuUJXxbd3f3G4TNjQAC1oKMAIiDs+jo6DiIMv8QZb4NhX2aml1Gotpf4witUWgv1hkYxvXILMYAfp7NZu9HsVuIYzeJJ2XXLNbPSP8AW1M+GrjBBVEYXc6AHYOJ9jlh2INghvRTyaeRPDaS57cxzC3Kw9zIIGAr6SOD41C51KDg30KBtR7ySykwhtKNwk+Ad24UuRcyTNnF9ffoiq0uy6AS2aeQWcJ4ZCVjmOcV19zcXHPo0KGFBLVdRV23BkhTwLuhF8jjBfyhul+wzRkCpyQCjXoL8MuMtB9D6VdDa6BnILUMnxtqjQT5c3kUdatWz3fmazu8OUNgbCOgbSYo/rJUNnsRC36Lpk+fnh3uiWl1/pG4EPnjWUMZLnvjGwKjGoEMLcdanmBfZWWlZq7MGQKGQIIArctipnh7aEV+kvDMP7kI2Er6ycV/wN0ZaF8Gw2dbvBnIAGTswhBwHJ1c8hu6WBtZVNdahzlDwBBIEEinnaUYRw9G8ucJz/yTj4B1sU7+fxCXIIpSLAK6e1kwfOwUKZIVwxA4ZRCg4fCf4M3Bb5wyJbKCGAKnCgLs3ZrIzNVGZrGWnCqlsnL0IzBeu1jaYjOJxbiz8f2TrQxsHaE8/gP5/JJX3mdZJvGeuraflDvtr5vNOsqccqaFjw2BcbcXS6+uBvlgeeRFeoV1gY1+n0FYx/sMSqso6Z/me5LF0rZBq898LyiE+S2F4vRRuTyKN0h0h9E6Q+iXDLMcqca+W34MqZ4fEJebXTHDpCf5LVaHvopvwWlXU9cBzzt2ZKWktTfWSj0aYW8LwzY8uK6VZT3TWTiVoX4DmRfU/lpWXbA11d3u9lr81vCW5Qf92mFxzb4DLbS2QIvhBdBGu/I6V4qWzlOCictHEFz4xmB4frf2h6SuKQFFk+D4UwSUQqr9ago45UHk7QJT3lIvjJh4CcySb5qQXSfwa1SDbyh0mnckFSCSbmVR5Iv21ri/CQjSvgEzRkChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgChoAhYAgYAoaAIWAIGAKGgCFgCBgC4w6B/wcE9U5mUtfxBgAAAABJRU5ErkJggg==";

export function generateReceipt(data: ReceiptData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  // Logo
  const logoWidth = 40;
  const logoHeight = 25;
  doc.addImage(LOGO_BASE64, "PNG", (pageWidth - logoWidth) / 2, y, logoWidth, logoHeight);
  y += logoHeight + 8;

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

  doc.save(`receipt-${data.orderId}.pdf`);
}
