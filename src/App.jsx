import { useState, useMemo } from "react";

const CLASSES = [{"code":"P1 Eng Thurs 5pm","level":"Primary 1","type":"Primary 1 English","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 1"},{"code":"P2 Eng Mon 3pm","level":"Primary 2","type":"Primary 2 English","day":"Monday","time":"03:00 PM - 04:45 PM","room":"Room 1"},{"code":"P3 Eng Mon 7pm","level":"Primary 3","type":"Primary 3 English","day":"Monday","time":"07:00 PM - 08:45 PM","room":"Room 1"},{"code":"P3BC Ma Sat 9am","level":"Primary 3","type":"Primary 3 Math","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"Room 1"},{"code":"P4 Eng Mon 5pm","level":"Primary 4","type":"Primary 4 English","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 1"},{"code":"S1 G2 Ma Sun 11am","level":"Secondary 1","type":"Secondary 1 Math","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 1"},{"code":"S3 G3 Ma Sun 9am","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Sunday","time":"09:00 AM - 10:45 AM","room":"Room 1"},{"code":"S3 G2 Ma Sun 2pm","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 1"},{"code":"P5 Eng Wed 3pm","level":"Primary 5","type":"Primary 5 English","day":"Wednesday","time":"03:00 PM - 04:45 PM","room":"Room 1"},{"code":"P6BC Ma Fri 3pm","level":"Primary 6","type":"Primary 6 Math","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 1"},{"code":"P6A Ma Fri 5pm","level":"Primary 6","type":"Primary 6 Math","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 1"},{"code":"[BL] Ma Fri 7pm","level":"Bloom Programme","type":"Bloom Programme","day":"Friday","time":"07:00 PM - 08:45 PM","room":"Room 1"},{"code":"P6 Eng Wed 5pm","level":"Primary 6","type":"Primary 6 English","day":"Wednesday","time":"05:00 PM - 06:45 PM","room":"Room 1"},{"code":"P6 Eng Sat 2pm","level":"Primary 6","type":"Primary 6 English","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 1"},{"code":"S2/S4 Ma Wed 7pm","level":"Secondary 1,Secondary 2,Secondary 3,Secondary 4","type":"Secondary 2 Math,Secondary 4 E Math","day":"Wednesday","time":"07:00 PM - 08:45 PM","room":"Room 1"},{"code":"[BL] P5 P6 Ma Tues 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Tuesday","time":"03:00 PM - 04:45 PM","room":"Room 1"},{"code":"[BL] P5 P6 Ma Tues 5pm","level":"Bloom Programme","type":"Bloom Programme","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 1"},{"code":"[BL] Ma Tues 7pm","level":"Bloom Programme","type":"Bloom Programme","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 1"},{"code":"P4 Eng Thurs 3pm","level":"Primary 4","type":"Primary 4 English","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 1"},{"code":"S2 G3 Ma Sun 4pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 1"},{"code":"P6 Eng Thurs 7pm","level":"Primary 6","type":"Primary 6 English","day":"Thursday","time":"07:00 PM - 08:45 PM","room":"Room 1"},{"code":"[BL] Ma Sat 11am (2)","level":"Bloom Programme","type":"Bloom Programme","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 1"},{"code":"P6 Eng Sat 4pm","level":"Primary 6","type":"Primary 6 English","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 1"},{"code":"S1 G2 Ma Sat 9am","level":"Secondary 1","type":"Secondary 1 Math","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"Room 2"},{"code":"S2 G2 Ma Thurs 7pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Thursday","time":"07:00 PM - 08:45 PM","room":"Room 2"},{"code":"S2 G2 Ma Sat 2pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 2"},{"code":"S2 G3 Ma Sat 4pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 2"},{"code":"S3 G3 Ma Mon 7pm","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Monday","time":"07:00 PM - 08:45 PM","room":"Room 2"},{"code":"S3 G3 Ma Sat 11am","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 2"},{"code":"P5 Ma Tues 3pm","level":"Primary 5","type":"Primary 5 Math","day":"Tuesday","time":"03:00 PM - 04:45 PM","room":"Room 2"},{"code":"[BL] P5 Ma Tues 7pm","level":"Bloom Programme","type":"Bloom Programme","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 2"},{"code":"P6D Ma Tues 5pm","level":"Primary 6","type":"Primary 6 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 2"},{"code":"S1 G3 Ma Thurs 5pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 2"},{"code":"S1 G3 Ma Mon 5pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 2"},{"code":"S1 Ma Fri 7pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Friday","time":"07:00 PM - 08:45 PM","room":"Room 3"},{"code":"S2 G3 Ma Fri 5pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 3"},{"code":"S3 G3 Ma Tues 7pm","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 3"},{"code":"S3 G3 Ma (A-Math) Sat 11am","level":"Secondary 3","type":"Secondary 3 A Math","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 3"},{"code":"S4 G2 Ma Sat 2pm","level":"Secondary 4","type":"Secondary 4 A Math,Secondary 4 E Math","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 3"},{"code":"S4 G3 Ma Sat 4pm","level":"Secondary 4","type":"Secondary 4 A Math,Secondary 4 E Math","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 3"},{"code":"P5B Ma Wed 7pm","level":"Primary 5","type":"Primary 5 Math","day":"Wednesday","time":"07:00 PM - 08:45 PM","room":"Room 3"},{"code":"P5B Ma Thurs 7pm","level":"Primary 5","type":"Primary 5 Math","day":"Thursday","time":"07:00 PM - 08:45 PM","room":"Room 3"},{"code":"P6A Ma Wed 5pm","level":"Primary 6","type":"Primary 6 Math","day":"Wednesday","time":"05:00 PM - 06:45 PM","room":"Room 3"},{"code":"P5/P6 Ma Sun 4pm (Foundation)","level":"Primary 5,Primary 6","type":"Primary 5 Math,Primary 6 Math","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 3"},{"code":"P4BC Ma Wed 3pm","level":"Primary 4","type":"Primary 4 Math","day":"Wednesday","time":"03:00 PM - 04:45 PM","room":"Room 3"},{"code":"[BL] P4 Ma Thurs 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 3"},{"code":"[BL] P4 / P6 Thurs 5pm","level":"Bloom Programme","type":"Bloom Programme","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 3"},{"code":"[BL] Sec Ma Fri 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 3"},{"code":"[BL] P6 Ma Sun 2pm","level":"Bloom Programme","type":"Bloom Programme","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 3"},{"code":"Brain Train 2026 - Mon 3.15pm","level":"Brain Train Programme","type":"Brain Train","day":"Monday","time":"03:15 PM - 04:45 PM","room":"Room 3"},{"code":"S4 MA (A-Math) Sat 9am","level":"Secondary 4","type":"Secondary 4 A Math","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"Room 3"},{"code":"S1 G3 Ma Tue 5pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 3"},{"code":"P3AB Ma Sat 2pm","level":"Primary 3","type":"Primary 3 Math","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 4"},{"code":"S1 G2 Ma Mon 5pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 4"},{"code":"S2 G2 Ma Mon 7pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Monday","time":"07:00 PM - 08:45 PM","room":"Room 4"},{"code":"S2 G3 Ma Tues 5pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 4"},{"code":"S2 G2 Ma Tues 7pm","level":"Secondary 2","type":"Secondary 2 Math","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 4"},{"code":"S3 G3 Ma Wed 7pm","level":"Secondary 3","type":"Secondary 3 E Math,Secondary 3 A Math","day":"Wednesday","time":"07:00 PM - 08:45 PM","room":"Room 4"},{"code":"P5 Eng Sat 11am","level":"Primary 5","type":"Primary 5 English","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 4"},{"code":"P4 Sci Sun 2pm","level":"Primary 4","type":"Primary 4 Science","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 4"},{"code":"S3 G2 Ma Thurs 7pm","level":"Secondary 3","type":"Secondary 3 E Math","day":"Thursday","time":"07:00 PM - 08:45 PM","room":"Room 4"},{"code":"Brain Train 2026 - Tue 3.15pm","level":"Brain Train Programme","type":"Brain Train","day":"Tuesday","time":"03:15 PM - 04:45 PM","room":"Room 4"},{"code":"P4A Ma Thur 3pm (2)","level":"Primary 4","type":"Primary 4 Math","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 4"},{"code":"P3 Ma Sun 11am","level":"Primary 3","type":"Primary 3 Math","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 4"},{"code":"P4C Ma Sun 9am","level":"Primary 4","type":"Primary 4 Math","day":"Sunday","time":"09:00 AM - 10:45 AM","room":"Room 4"},{"code":"P4 Eng Fri 3pm","level":"Primary 4","type":"Primary 4 English","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 4"},{"code":"P3 Sci Fri 5pm","level":"Primary 3","type":"Primary 3 Science","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 4"},{"code":"[BL] P6F Ma Sun 4pm","level":"Bloom Programme","type":"Bloom Programme","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 4"},{"code":"[BL] P5 Ma Sat 4pm","level":"Bloom Programme","type":"Bloom Programme","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 4"},{"code":"P4 Sun 11am Eng","level":"Primary 4","type":"Primary 4 English","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 4"},{"code":"P6 Ma Thurs 7.15pm (ONLINE)","level":"Primary 6","type":"Primary 6 Math Online","day":"Thursday","time":"07:15 PM - 09:15 PM","room":"Online"},{"code":"P5 Ma Fri 7.15pm ONLINE","level":"Primary 5","type":"Primary 5 Math Online","day":"Friday","time":"07:15 PM - 08:45 PM","room":"Online"},{"code":"P3 Ma Tues 3pm (ONLINE)","level":"Primary 3","type":"Primary 3 Math Online","day":"Tuesday","time":"03:00 PM - 04:30 PM","room":"Online"},{"code":"P1 Ma Tues 5pm","level":"Primary 1","type":"Primary 1 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 5"},{"code":"P4CD Ma Fri 3pm","level":"Primary 4","type":"Primary 4 Math","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 5"},{"code":"P3A Ma Fri 5pm","level":"Primary 3","type":"Primary 3 Math","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 5"},{"code":"Brain Train 2026 - Thurs 5.00pm","level":"Brain Train Programme","type":"Brain Train","day":"Thursday","time":"05:00 PM - 06:30 PM","room":"Room 5"},{"code":"P2 Ma Mon 5pm","level":"Primary 2","type":"Primary 2 Math","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 5"},{"code":"[BL] P4 Ma Mon 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Monday","time":"03:00 PM - 04:45 PM","room":"Room 5"},{"code":"Brain Train 2026 - Tues 7pm","level":"Brain Train Programme","type":"Brain Train","day":"Tuesday","time":"07:00 PM - 08:30 PM","room":"Room 5"},{"code":"Brain Train 2026 - Wed 5pm","level":"Brain Train Programme","type":"Brain Train","day":"Wednesday","time":"05:00 PM - 06:30 PM","room":"Room 5"},{"code":"P3 Sci Tues 7pm","level":"Primary 3","type":"Primary 3 Science","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 5"},{"code":"P3BC Ma Fri 3pm","level":"Primary 3","type":"Primary 3 Math","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 6"},{"code":"P3AB Ma Wed 5pm","level":"Primary 3","type":"Primary 3 Math","day":"Wednesday","time":"05:00 PM - 06:45 PM","room":"Room 6"},{"code":"P4A Ma Tues 5pm","level":"Primary 4","type":"Primary 4 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 6"},{"code":"P4CD Ma Thurs 3pm","level":"Primary 4","type":"Primary 4 Math","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 6"},{"code":"P4ABC Ma Fri 5pm","level":"Primary 4","type":"Primary 4 Math","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 6"},{"code":"P4BC Ma Sat 9am","level":"Primary 4","type":"Primary 4 Math","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"Room 6"},{"code":"P4BC Ma Sat 11am","level":"Primary 4","type":"Primary 4 Math","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 6"},{"code":"S1 G3 Ma Sun 4pm","level":"Secondary 1","type":"Secondary 1 Math","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 6"},{"code":"S1-S4 G1 Ma Tues 7pm","level":"Secondary 1,Secondary 2,Secondary 3,Secondary 4","type":"Secondary 1 Math,Secondary 2 Math,Secondary 3 E Math,Secondary 4 E Math","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 6"},{"code":"S3 G3 Ma (A-Math) Sun 11am","level":"Secondary 3","type":"Secondary 3 A Math","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 6"},{"code":"P5A Ma Mon 3pm","level":"Primary 5","type":"Primary 5 Math","day":"Monday","time":"03:00 PM - 04:45 PM","room":"Room 6"},{"code":"P5BC Ma Wed 3pm","level":"Primary 5","type":"Primary 5 Math","day":"Wednesday","time":"03:00 PM - 04:45 PM","room":"Room 6"},{"code":"P5AC Ma Thurs 5pm","level":"Primary 5","type":"Primary 5 Math","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 6"},{"code":"[BL] P5 Ma Sat 2pm","level":"Bloom Programme","type":"Bloom Programme","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 6"},{"code":"P4BC Ma Tues 3pm","level":"Primary 4","type":"Primary 4 Math","day":"Tuesday","time":"03:00 PM - 04:45 PM","room":"Room 6"},{"code":"[BL] P3 P4 Ma Mon 5pm","level":"Bloom Programme","type":"Bloom Programme","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 6"},{"code":"P6A Ma Sun 2pm","level":"Primary 6","type":"Primary 6 Math","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 6"},{"code":"P5 Ma Sun 9am","level":"Primary 5","type":"Primary 5 Math","day":"Sunday","time":"09:00 AM - 10:45 AM","room":"Room 6"},{"code":"P2 Ma Wed 3pm","level":"Primary 2","type":"Primary 2 Math","day":"Wednesday","time":"03:00 PM - 04:45 PM","room":"Room 7"},{"code":"P3A Ma Thurs 7pm","level":"Primary 3","type":"Primary 3 Math","day":"Thursday","time":"07:00 PM - 08:45 PM","room":"Room 7"},{"code":"[BL] P5 Sci Mon 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Monday","time":"03:00 PM - 04:45 PM","room":"Room 7"},{"code":"P4 Sci Sat 4pm","level":"Primary 4","type":"Primary 4 Science","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 7"},{"code":"S1 Sci Fri 7pm","level":"Secondary 1","type":"Secondary 1 Science","day":"Friday","time":"07:00 PM - 08:45 PM","room":"Room 7"},{"code":"S1 Sci Sun 9am","level":"Secondary 1","type":"Secondary 1 Science","day":"Sunday","time":"09:00 AM - 10:45 AM","room":"Room 7"},{"code":"P5 Sci Mon 7pm","level":"Primary 5","type":"Primary 5 Science","day":"Monday","time":"07:00 PM - 08:45 PM","room":"Room 7"},{"code":"P6 Sci Tues 5pm","level":"Primary 6","type":"Primary 6 Science","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 7"},{"code":"P5 Sci Fri 3pm","level":"Primary 5","type":"Primary 5 Science","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 7"},{"code":"P5 Sci Sat 2pm","level":"Primary 5","type":"Primary 5 Science","day":"Saturday","time":"02:00 PM - 03:45 PM","room":"Room 7"},{"code":"P5 Sci Sun 11am","level":"Primary 5","type":"Primary 5 Science","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 7"},{"code":"P6 Sci Mon 5pm","level":"Primary 6","type":"Primary 6 Science","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 7"},{"code":"P6 Sci Tues 7pm","level":"Primary 6","type":"Primary 6 Science","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 7"},{"code":"P6 Sci Fri 5pm","level":"Primary 6","type":"Primary 6 Science","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 7"},{"code":"P6 Sci Sun 4pm","level":"Primary 6","type":"Primary 6 Science","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 7"},{"code":"P6 Sci Sat 11am","level":"Primary 6","type":"Primary 6 Science","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 7"},{"code":"P2 Eng Thurs 5pm","level":"Primary 2","type":"Primary 2 English","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 7"},{"code":"P3AC Ma Thurs 3pm","level":"Primary 3","type":"Primary 3 Math","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 7"},{"code":"P6 Sci Sun 2pm","level":"Primary 6","type":"Primary 6 Science","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 7"},{"code":"P3C Ma Wed 5pm (2)","level":"Primary 3","type":"Primary 3 Math","day":"Wednesday","time":"05:00 PM - 06:45 PM","room":"Room 7"},{"code":"P3 Sci Wed 7pm","level":"Primary 3","type":"Primary 3 Science","day":"Wednesday","time":"07:00 PM - 08:45 PM","room":"Room 7"},{"code":"P4 Ma Mon 3pm","level":"Primary 4","type":"Primary 4 Math","day":"Monday","time":"03:00 PM - 04:45 PM","room":"Room 8"},{"code":"P4B Ma Wed 7pm","level":"Primary 4","type":"Primary 4 Math","day":"Wednesday","time":"07:00 PM - 08:45 PM","room":"Room 8"},{"code":"P5AB Ma Mon 5pm","level":"Primary 5","type":"Primary 5 Math","day":"Monday","time":"05:00 PM - 06:45 PM","room":"Room 8"},{"code":"P5B Ma Tues 5pm","level":"Primary 5","type":"Primary 5 Math","day":"Tuesday","time":"05:00 PM - 06:45 PM","room":"Room 8"},{"code":"P5AB Ma Wed 5pm","level":"Primary 5","type":"Primary 5 Math","day":"Wednesday","time":"05:00 PM - 06:45 PM","room":"Room 8"},{"code":"P5AB Ma Fri 3pm","level":"Primary 5","type":"Primary 5 Math","day":"Friday","time":"03:00 PM - 04:45 PM","room":"Room 8"},{"code":"P5CD Ma Fri 5pm","level":"Primary 5","type":"Primary 5 Math","day":"Friday","time":"05:00 PM - 06:45 PM","room":"Room 8"},{"code":"P5A Ma Sun 11am","level":"Primary 5","type":"Primary 5 Math","day":"Sunday","time":"11:00 AM - 12:45 PM","room":"Room 8"},{"code":"P5B Ma Sun 4pm","level":"Primary 5","type":"Primary 5 Math","day":"Sunday","time":"04:00 PM - 05:45 PM","room":"Room 8"},{"code":"P6A Ma Tues 3pm","level":"Primary 6","type":"Primary 6 Math","day":"Tuesday","time":"03:00 PM - 04:45 PM","room":"Room 8"},{"code":"P6AC Ma Tues 7pm","level":"Primary 6","type":"Primary 6 Math","day":"Tuesday","time":"07:00 PM - 08:45 PM","room":"Room 8"},{"code":"P6AC Ma Wed 3pm","level":"Primary 6","type":"Primary 6 Math","day":"Wednesday","time":"03:00 PM - 04:45 PM","room":"Room 8"},{"code":"P6B Ma Thurs 5pm","level":"Primary 6","type":"Primary 6 Math","day":"Thursday","time":"05:00 PM - 06:45 PM","room":"Room 8"},{"code":"P6BC Ma Sat 9am","level":"Primary 6","type":"Primary 6 Math","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"Room 8"},{"code":"P6D Ma Sat 11am","level":"Primary 6","type":"Primary 6 Math","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"Room 8"},{"code":"P6B Ma Sat 4pm","level":"Primary 6","type":"Primary 6 Math","day":"Saturday","time":"04:00 PM - 05:45 PM","room":"Room 8"},{"code":"P6B Ma Sun 9am","level":"Primary 6","type":"Primary 6 Math","day":"Sunday","time":"09:00 AM - 10:45 AM","room":"Room 8"},{"code":"[BL] P6 Ma Sun 2pm (2)","level":"Bloom Programme","type":"Bloom Programme","day":"Sunday","time":"02:00 PM - 03:45 PM","room":"Room 8"},{"code":"[BL] P3 P4 Ma Thurs 3pm (2)","level":"Bloom Programme","type":"Bloom Programme","day":"Thursday","time":"03:00 PM - 04:45 PM","room":"Room 8"},{"code":"P3AB Ma Mon 7pm","level":"Primary 3","type":"Primary 3 Math","day":"Monday","time":"07:00 PM - 08:45 PM","room":"Room 8"},{"code":"[BL] P5 P6 Ma Mon 3pm","level":"Bloom Programme","type":"Bloom Programme","day":"Monday","time":"03:00 PM - 04:45 PM","room":"P Office"},{"code":"[BL] Ma Sat 9am","level":"Bloom Programme","type":"Bloom Programme","day":"Saturday","time":"09:00 AM - 10:45 AM","room":"P Office"},{"code":"[BL] Ma Sat 11am","level":"Bloom Programme","type":"Bloom Programme","day":"Saturday","time":"11:00 AM - 12:45 PM","room":"P Office"},{"code":"[BL] Ma Mon 5pm","level":"Bloom Programme","type":"Bloom Programme","day":"Monday","time":"05:00 PM - 06:45 PM","room":"P Office"}];

const TEACHERS = ["Rachel", "Deslyn", "Rui En", "Jeremy", "Jerlyn", "Charmaine", "Emily", "Belize", "Shannon", "Melody", "Aaron", "Vivienne", "Yun Zhen", "Amanda", "Gaby", "Sandra", "Humphrey", "Heather", "Eleanor"];

const DAYS_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// TNA Brand colours from brand guide
const TNA = {
  cream: "#FFF9EF",
  black: "#000000",
  yellow: "#FFD817",
  pink: "#FF86BB",
  orange: "#FF6632",
  blue: "#0074FF",
  green: "#7ED597",
};

function formatTime(t) {
  // Convert "05:00 PM - 07:30 PM" → "5.00pm - 7.30pm"
  return t.replace(/(\d{2}):(\d{2}) (AM|PM)/g, (_, h, m, period) => {
    const hour = parseInt(h, 10);
    return `${hour}.${m}${period.toLowerCase()}`;
  });
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });
}
function getDayAbbr(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-SG", { weekday: "long" });
}

// Get Mon–Sun dates for the week containing a given date
function getWeekDates(dateStr) {
  if (!dateStr) return {};
  const d = new Date(dateStr);
  if (isNaN(d)) return {};
  // Get Monday of that week
  const day = d.getDay(); // 0=Sun,1=Mon...6=Sat
  const diffToMon = (day === 0) ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diffToMon);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const result = {};
  days.forEach((name, i) => {
    const dd = new Date(mon);
    dd.setDate(mon.getDate() + i);
    result[name] = dd;
  });
  return result;
}

function formatShortDate(dateObj) {
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
}

function formatFullDate(dateObj) {
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    // Primary: clipboard API (works on HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback: textarea trick (works everywhere including Notion embeds)
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button onClick={copy} style={{
      padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
      background: copied ? TNA.green : TNA.yellow,
      color: TNA.black, fontSize: 14, fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      transition: "all 0.2s", whiteSpace: "nowrap",
      boxShadow: copied ? "none" : "0 2px 8px rgba(255,216,23,0.4)",
    }}>{copied ? "✓ Copied!" : label || "Copy"}</button>
  );
}

function MessageBox({ title, text, accentColor, num }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, overflow: "hidden",
      marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: `2px solid ${accentColor}`,
    }}>
      <div style={{
        background: accentColor, padding: "12px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white",
            fontFamily: "Poppins, sans-serif",
          }}>{num}</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "white", fontFamily: "Poppins, sans-serif" }}>{title}</span>
        </div>
        <CopyButton text={text} />
      </div>
      <div style={{
        padding: "18px 20px", fontSize: 14, lineHeight: 2,
        color: "#222", whiteSpace: "pre-wrap",
        fontFamily: "Poppins, sans-serif", background: "#FAFAFA",
      }}>{text}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type }) {
  return (
    <div>
      <label style={{
        fontSize: 12, fontWeight: 600, color: "#555",
        fontFamily: "Poppins, sans-serif", display: "block",
        marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
      }}>{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          border: "2px solid #E8E8E8", fontSize: 15,
          fontFamily: "Poppins, sans-serif", outline: "none",
          background: "white", color: TNA.black,
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = TNA.yellow}
        onBlur={e => e.target.style.borderColor = "#E8E8E8"}
      />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label style={{
        fontSize: 12, fontWeight: 600, color: "#555",
        fontFamily: "Poppins, sans-serif", display: "block",
        marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
      }}>{label}</label>
      <select value={value} onChange={onChange} style={{
        width: "100%", padding: "12px 14px", borderRadius: 10,
        border: "2px solid #E8E8E8", fontSize: 15,
        fontFamily: "Poppins, sans-serif", outline: "none",
        background: "white", color: TNA.black,
        boxSizing: "border-box", cursor: "pointer",
      }}
      onFocus={e => e.target.style.borderColor = TNA.yellow}
      onBlur={e => e.target.style.borderColor = "#E8E8E8"}
      >{children}</select>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [subject, setSubject] = useState("");
  const [missedDate, setMissedDate] = useState("");
  const [missedTime, setMissedTime] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slotDay, setSlotDay] = useState("Monday");
  const [slotSearchCode, setSlotSearchCode] = useState("");
  const [slotTeachers, setSlotTeachers] = useState({});
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const [origTeacher, setOrigTeacher] = useState("");
  const [makeupTeacher, setMakeupTeacher] = useState("");
  const [makeupDate, setMakeupDate] = useState("");

  const filteredClasses = useMemo(() => {
    return CLASSES.filter(c => {
      if (c.day !== slotDay) return false;
      if (slotSearchCode && !c.code.toLowerCase().includes(slotSearchCode.toLowerCase()) && !c.type.toLowerCase().includes(slotSearchCode.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      // Sort by start time: convert "03:00 PM" to comparable value
      const toMins = t => {
        const start = t.split(" - ")[0];
        const [time, period] = start.split(" ");
        const [h, m] = time.split(":").map(Number);
        return (period === "PM" && h !== 12 ? h + 12 : (period === "AM" && h === 12 ? 0 : h)) * 60 + m;
      };
      return toMins(a.time) - toMins(b.time);
    });
  }, [slotDay, slotSearchCode]);

  // Compute week dates from missed date
  const weekDates = useMemo(() => getWeekDates(missedDate), [missedDate]);

  const toggleSlot = (cls) => {
    setSelectedSlots(prev =>
      prev.find(s => s.code === cls.code)
        ? prev.filter(s => s.code !== cls.code)
        : [...prev, cls]
    );
  };

  const part1Message = useMemo(() => {
    if (!selectedSlots.length) return "";
    const pn = parentName || "[Parent\'s Name]";
    const cn = childName || "[Child\'s Name]";
    const sub = subject || "[Subject]";
    const md = missedDate ? formatDate(missedDate) : "[Date]";
    const mday = missedDate ? getDayAbbr(missedDate) : "[Day]";
    const mt = missedTime || "[Time]";
    const wDates = getWeekDates(missedDate);
    const slotLines = selectedSlots.map((s, i) => {
      const teacher = slotTeachers[s.code];
      const teacherStr = teacher ? ` — ${teacher}` : "";
      const slotDateObj = wDates[s.day];
      const slotDateStr = slotDateObj ? formatFullDate(slotDateObj) + ", " : "";
      return `${i + 1}. ${slotDateStr}${s.day}${teacherStr}, ${formatTime(s.time)}`;
    }).join("\n");
    return `Hi ${pn},\nNoted with thanks that ${cn} will be missing the ${sub} lesson on:\n${md}, ${mday}, ${mt}\n\nThe following make-up slots are currently available:\n\n${slotLines}\n\nKindly let us know your preferred make-up slot and we\'ll reserve it accordingly. Slots are subject to availability and on a first-come, first-served basis.\nThank you 🙂`;
  }, [parentName, childName, subject, missedDate, missedTime, selectedSlots, slotTeachers]);

  const part2Messages = useMemo(() => {
    if (!confirmedSlot) return null;
    const pn = parentName || "[Parent\'s Name]";
    const cn = childName || "[Child\'s Name]";
    const sub = subject || "[Subject]";
    const origDate = missedDate ? formatDate(missedDate) : "[Original Date]";
    const origDay = missedDate ? getDayAbbr(missedDate) : "[Day]";
    const origTime = missedTime || "[Time]";
    const wDates = getWeekDates(missedDate);
    const newDateObj = confirmedSlot && wDates[confirmedSlot.day] ? wDates[confirmedSlot.day] : null;
    const newDate = newDateObj ? formatFullDate(newDateObj) : "[New Date]";
    const newDay = confirmedSlot ? confirmedSlot.day : "[Day]";
    const newTime = formatTime(confirmedSlot.time);
    const ot = origTeacher || "[Original Teacher]";
    const mt = makeupTeacher || "[Make-up Teacher]";

    return {
      parentConfirm: `Hi ${pn},\nThis is to confirm that ${cn}\'s ${sub} lesson on *${origDate}, ${origDay}, ${origTime}* has been rescheduled to *${newDate}, ${newDay}, ${newTime}*.\n\nPlease note that we will not be able to further reschedule — if the make-up slot is missed, it will be considered forfeited. Please let us know if you need any further assistance. Thank you 🙂`,
      origTeacherMsg: `Hi ${ot},\n\n*Makeup Lesson Notification*\nStudent Name: ${cn}\nSubject: ${sub}\n*Original class:* ${confirmedSlot.code || "[Original Class]"}\nDate: ${origDate}, ${origDay}, ${origTime}\n\nStudent will be attending make-up at: ${confirmedSlot.code}\nDate: ${newDate}, ${newDay}, ${newTime}\nWith: ${mt}\n\nThank you.`,
      makeupTeacherMsg: `Hi ${mt},\n\n*Makeup Lesson Notification*\nPlease be informed that ${cn} (${sub}) will be joining your class for a make-up lesson:\n\n*Make-up class:* ${confirmedSlot.code}\nDate: ${newDate}, ${newDay}\nTime: ${newTime}\n\nOriginal class: ${origDate}, ${origDay}, ${origTime} (${ot}\'s class)\n\nThank you.`,
      sleekflowMsg: `Hi ${pn}, gentle reminder that ${cn} has a ${sub} make-up class tomorrow, ${newDate} ${newDay} ${newTime} 🙂`,
    };
  }, [parentName, childName, subject, missedDate, missedTime, confirmedSlot, origTeacher, makeupTeacher, makeupDate]);

  const card = {
    background: "white", borderRadius: 16, padding: 24,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 20,
  };
  const sectionLabel = {
    fontSize: 11, fontWeight: 800, letterSpacing: 1.2,
    textTransform: "uppercase", fontFamily: "Poppins, sans-serif",
    color: "#888", marginBottom: 16,
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: TNA.cream, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: TNA.black, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: TNA.yellow,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: TNA.black,
          }}>N</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "white", letterSpacing: 0.3 }}>
              Reschedule Message Generator
            </div>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>The Nuggets Academy · Admin & Ops</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, background: "#1a1a1a", borderRadius: 12, padding: 4 }}>
          {[
            { id: 1, label: "Part 1 — Offer Slots", color: TNA.yellow },
            { id: 2, label: "Part 2 — Confirm & Notify", color: TNA.green },
          ].map(t => (
            <button key={t.id} onClick={() => setStep(t.id)} style={{
              padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700, fontFamily: "Poppins, sans-serif",
              background: step === t.id ? t.color : "transparent",
              color: step === t.id ? TNA.black : "#666",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* SHARED: Student details */}
        <div style={{ ...card, borderTop: `4px solid ${TNA.yellow}` }}>
          <div style={sectionLabel}>📋 Student & Class Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 16 }}>
            <Input label="Parent's Name" value={parentName} onChange={e => setParentName(e.target.value)} placeholder="e.g. Mrs Tan" />
            <Input label="Child's Name" value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Aiden" />
            <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Math" />
            <Input label="Missed Class Date" value={missedDate} onChange={e => setMissedDate(e.target.value)} type="date" />
          </div>
          <div style={{ maxWidth: 300 }}>
            <Input label="Missed Class Time" value={missedTime} onChange={e => setMissedTime(e.target.value)} placeholder="e.g. 5:00pm – 6:45pm" />
          </div>
        </div>

        {/* Week range banner */}
        {missedDate && Object.keys(weekDates).length > 0 && (
          <div style={{
            background: TNA.yellow, borderRadius: 12, padding: "12px 20px",
            marginBottom: 20, display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>📅</span>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: TNA.black }}>Make-up week: </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: TNA.black }}>
                {formatFullDate(weekDates["Monday"])} – {formatFullDate(weekDates["Sunday"])}
              </span>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 13, color: "#666", fontWeight: 500 }}>
              All available slots shown are within this week
            </div>
          </div>
        )}

        {/* PART 1 */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20 }}>

            {/* Slot picker */}
            <div style={{ ...card, borderTop: `4px solid ${TNA.blue}` }}>
              <div style={sectionLabel}>🗓️ Select Available Make-up Slots</div>

              {/* Day tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {DAYS_ORDER.map(d => (
                  <button key={d} onClick={() => setSlotDay(d)} style={{
                    padding: "8px 16px", borderRadius: 8, border: "2px solid",
                    borderColor: slotDay === d ? TNA.blue : "#E8E8E8",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    fontFamily: "Poppins, sans-serif",
                    background: slotDay === d ? TNA.blue : "white",
                    color: slotDay === d ? "white" : "#888",
                    transition: "all 0.15s",
                  }}>{d.slice(0,3)}</button>
                ))}
              </div>

              {/* Search */}
              <input
                value={slotSearchCode}
                onChange={e => setSlotSearchCode(e.target.value)}
                placeholder="🔍  Filter by class code or subject..."
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  border: "2px solid #E8E8E8", fontSize: 14, marginBottom: 14,
                  fontFamily: "Poppins, sans-serif", outline: "none",
                  background: "white", boxSizing: "border-box",
                }}
              />

              {/* Class list */}
              <div style={{ maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {filteredClasses.length === 0 && (
                  <div style={{ color: "#ccc", fontSize: 14, padding: 12, textAlign: "center" }}>No classes found</div>
                )}
                {filteredClasses.map(cls => {
                  const sel = selectedSlots.find(s => s.code === cls.code);
                  return (
                    <div key={cls.code} onClick={() => toggleSlot(cls)} style={{
                      background: sel ? "#F0FFF4" : "#FAFAFA",
                      border: `2px solid ${sel ? TNA.green : "#EBEBEB"}`,
                      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "all 0.15s",
                    }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: sel ? "#1a7a3a" : TNA.black }}>{cls.code}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{cls.day} · {formatTime(cls.time)} · {cls.room}</div>
                      </div>
                      {sel && (
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: TNA.green, display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 13, color: "white", fontWeight: 700,
                        }}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message preview */}
            <div>
              <div style={{ ...card, borderTop: `4px solid ${TNA.orange}`, position: "sticky", top: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={sectionLabel}>💬 Message to Parent</div>
                  {selectedSlots.length > 0 && <CopyButton text={part1Message} label="Copy Message" />}
                </div>

                {selectedSlots.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    color: "#CCC", fontSize: 14,
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
                    Select slots to generate the parent message
                  </div>
                ) : (
                  <>
                    <div style={{
                      background: TNA.cream, border: `2px solid #F0E8D0`, borderRadius: 12,
                      padding: "16px 18px", fontSize: 14, lineHeight: 1.9,
                      color: TNA.black, whiteSpace: "pre-wrap", marginBottom: 16,
                      fontFamily: "Poppins, sans-serif",
                    }}>{part1Message}</div>

                    <div style={{ borderTop: "2px dashed #F0F0F0", paddingTop: 14, marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#AAA", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Selected Slots</div>
                      {selectedSlots.map(s => (
                        <div key={s.code} style={{
                          display: "flex", justifyContent: "space-between",
                          padding: "8px 0", borderBottom: "1px solid #F5F5F5", fontSize: 13,
                        }}>
                          <span style={{ color: "#555", fontWeight: 500 }}>{s.day} · {formatTime(s.time)} · {s.code}</span>
                          <button onClick={e => { e.stopPropagation(); toggleSlot(s); }} style={{
                            background: "#FFE8E8", border: "none", borderRadius: 6,
                            color: TNA.orange, cursor: "pointer", fontSize: 14, padding: "0 8px", fontWeight: 700,
                          }}>×</button>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => { setConfirmedSlot(selectedSlots[0]); setStep(2); }} style={{
                      width: "100%", padding: "12px", borderRadius: 10, border: "none",
                      background: TNA.green, color: TNA.black,
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                    }}>→ Parent replied? Go to Part 2</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PART 2 */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>

            {/* Left: inputs */}
            <div>
              <div style={{ ...card, borderTop: `4px solid ${TNA.green}` }}>
                <div style={sectionLabel}>✅ Confirmed Make-up Details</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Select label="Original Class Teacher" value={origTeacher} onChange={e => setOrigTeacher(e.target.value)}>
                    <option value="">Select teacher...</option>
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>

                  <Select label="Make-up Class Teacher" value={makeupTeacher} onChange={e => setMakeupTeacher(e.target.value)}>
                    <option value="">Select teacher...</option>
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Confirmed Make-up Class</label>
                    {confirmedSlot ? (
                      <div style={{ background: "#F0FFF4", border: `2px solid ${TNA.green}`, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a7a3a" }}>{confirmedSlot.code}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{confirmedSlot.day} · {formatTime(confirmedSlot.time)} · {confirmedSlot.room}</div>
                        <button onClick={() => setConfirmedSlot(null)} style={{ marginTop: 10, fontSize: 12, color: TNA.orange, background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Change class →</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                          {DAYS_ORDER.map(d => (
                            <button key={d} onClick={() => setSlotDay(d)} style={{
                              padding: "6px 10px", borderRadius: 6, border: `2px solid ${slotDay === d ? TNA.blue : "#E8E8E8"}`,
                              cursor: "pointer", fontSize: 11, fontWeight: 600,
                              fontFamily: "Poppins, sans-serif",
                              background: slotDay === d ? TNA.blue : "white",
                              color: slotDay === d ? "white" : "#888",
                            }}>{d.slice(0,3)}</button>
                          ))}
                        </div>
                        <input value={slotSearchCode} onChange={e => setSlotSearchCode(e.target.value)}
                          placeholder="Search class..." style={{
                            width: "100%", padding: "10px 12px", borderRadius: 8,
                            border: "2px solid #E8E8E8", fontSize: 13, marginBottom: 8,
                            fontFamily: "Poppins, sans-serif", outline: "none",
                            background: "white", boxSizing: "border-box",
                          }} />
                        <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                          {filteredClasses.slice(0,30).map(cls => (
                            <div key={cls.code} onClick={() => setConfirmedSlot(cls)} style={{
                              background: "#FAFAFA", border: "2px solid #EBEBEB",
                              borderRadius: 8, padding: "10px 12px", cursor: "pointer",
                              transition: "border-color 0.15s",
                            }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: TNA.black }}>{cls.code}</div>
                              <div style={{ fontSize: 12, color: "#888" }}>{cls.day} · {formatTime(cls.time)} · {cls.room}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ marginTop: 20, background: TNA.cream, borderRadius: 12, padding: 16, border: `2px solid #F0E8D0` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>📝 Checklist</div>
                  {[
                    "Update Edulabs — remove from original class",
                    "Update Edulabs — add to make-up class (add remarks: \"[Name] make up for [Date]\")",
                    "Send all messages below",
                    "Schedule SleekFlow reminder",
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "#555", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16, color: TNA.yellow, lineHeight: 1.4 }}>☐</span>
                      <span style={{ fontWeight: 500 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: messages */}
            <div>
              {part2Messages ? (
                <>
                  <MessageBox num="1" title="Confirmation to Parent" text={part2Messages.parentConfirm} accentColor={TNA.yellow} />
                  <MessageBox num="2" title="Original Class Teacher" text={part2Messages.origTeacherMsg} accentColor={TNA.pink} />
                  <MessageBox num="3" title="Make-up Class Teacher" text={part2Messages.makeupTeacherMsg} accentColor={TNA.blue} />
                  <MessageBox num="4" title="SleekFlow Reminder — Schedule for Day Before" text={part2Messages.sleekflowMsg} accentColor={TNA.green} />
                </>
              ) : (
                <div style={{ ...card, textAlign: "center", padding: "60px 20px", color: "#CCC" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>Fill in the details on the left to generate all 4 messages</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
