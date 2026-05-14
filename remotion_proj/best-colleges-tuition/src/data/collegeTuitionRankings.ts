// Data adapted from ../../continuous_data_show/best-colleges-us-news.html.
// Rank order follows the U.S. News storytelling timeline used by that visualization.
// Tuition & Fees values are stored as numbers and displayed only when explicitly present.

export type CollegeKey = string;

export type CollegeMetadata = {
  name: string;
  color: string;
  admit?: number;
  grad?: number;
  tuitionFees?: Partial<Record<number, number>>;
};

export type RankingEntry = {
  key: CollegeKey;
  rank: number;
  name: string;
  color: string;
  tuitionFees: number | null;
  acceptanceRate: number | null;
  graduationRate: number | null;
  hasTuition: boolean;
  visualValue: number;
};

export type YearlyRanking = {
  year: number;
  entries: RankingEntry[];
};

export const START_YEAR = 1983;
export const END_YEAR = 2025;
export const YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index
);

export const COLLEGES: Record<CollegeKey, CollegeMetadata> = {
      princeton: { name: "Princeton", color: "#f0c35a", admit: 4, grad: 98, tuitionFees: { 2022: 57410, 2023: 59710, 2024: 62688, 2025: 65510 } },
      mit: { name: "MIT", color: "#27c7bd", admit: 4, grad: 96, tuitionFees: { 2022: 57986, 2023: 60156, 2024: 62396, 2025: 64730 } },
      harvard: { name: "Harvard", color: "#e45756", admit: 3, grad: 98, tuitionFees: { 2022: 57261, 2023: 59076, 2024: 61676, 2025: 64796 } },
      stanford: { name: "Stanford", color: "#4e79a7", admit: 4, grad: 96, tuitionFees: { 2022: 58416, 2023: 62484, 2024: 65910, 2025: 68544 } },
      yale: { name: "Yale", color: "#59a14f", admit: 4, grad: 97, tuitionFees: { 2022: 62250, 2023: 64700, 2024: 67250, 2025: 70085 } },
      caltech: { name: "Caltech", color: "#b07aa1", admit: 3, grad: 94, tuitionFees: { 2022: 60864, 2023: 63255, 2024: 65898, 2025: 68208 } },
      duke: { name: "Duke", color: "#45b7d1", admit: 6, grad: 96, tuitionFees: { 2022: 62688, 2023: 65805, 2024: 68758, 2025: 72877 } },
      hopkins: { name: "Johns Hopkins", color: "#ff9da7", admit: 7, grad: 94, tuitionFees: { 2022: 60980, 2023: 63340, 2024: 65230, 2025: 66670 } },
      northwestern: { name: "Northwestern", color: "#76b7b2", admit: 7, grad: 95, tuitionFees: { 2022: 63468, 2023: 65997, 2024: 68322, 2025: 70589 } },
      penn: { name: "Penn", color: "#f28e2b", admit: 6, grad: 96, tuitionFees: { 2022: 63452, 2023: 66104, 2024: 68686, 2025: 71236 } },
      cornell: { name: "Cornell", color: "#9c755f", admit: 8, grad: 95, tuitionFees: { 2022: 63200, 2023: 66014, 2024: 69314, 2025: 71690 } },
      uchicago: { name: "UChicago", color: "#af7aa1", admit: 5, grad: 95, tuitionFees: { 2022: 64260, 2023: 66939, 2024: 70662, 2025: 73266 } },
      brown: { name: "Brown", color: "#edc948", admit: 5, grad: 96, tuitionFees: { 2022: 65146, 2023: 68230, 2024: 71412, 2025: 74650 } },
      columbia: { name: "Columbia", color: "#8cd17d", admit: 4, grad: 95, tuitionFees: { 2022: 66139, 2023: 69045, 2024: 71845, 2025: 73450 } },
      dartmouth: { name: "Dartmouth", color: "#86bcb6", admit: 6, grad: 96, tuitionFees: { 2022: 62658, 2023: 65739, 2024: 68268, 2025: 71265 } },
      ucla: { name: "UCLA", color: "#499894", admit: 9, grad: 92, tuitionFees: { 2022: 44827, 2023: 47073, 2024: 49403, 2025: 53302 } },
      berkeley: { name: "UC Berkeley", color: "#fabfd2", admit: 11, grad: 93, tuitionFees: { 2022: 45821, 2023: 48176, 2024: 50547, 2025: 52536 } },
      rice: { name: "Rice", color: "#b6992d", admit: 8, grad: 94, tuitionFees: { 2022: 55295, 2023: 58468, 2024: 64144, 2025: 67497 } },
      notreDame: { name: "Notre Dame", color: "#1f77b4", admit: 12, grad: 96, tuitionFees: { 2022: 60301, 2023: 62693, 2024: 65025, 2025: 67607 } },
      vanderbilt: { name: "Vanderbilt", color: "#d37295", admit: 6, grad: 94, tuitionFees: { 2022: 60348, 2023: 63946, 2024: 67498, 2025: 71226 } },
      georgetown: { name: "Georgetown", color: "#7f7f7f", admit: 12, grad: 94 },
      virginia: { name: "Virginia", color: "#bcbd22", admit: 17, grad: 94 },
      michigan: { name: "Michigan", color: "#17becf", admit: 18, grad: 93 },
      emory: { name: "Emory", color: "#ffbf79", admit: 11, grad: 91 },
      carnegie: { name: "Carnegie Mellon", color: "#aec7e8", admit: 11, grad: 91 }
    };

export const ANCHOR_SNAPSHOTS: Array<{ year: number; order: CollegeKey[] }> = [
      { year: 1983, order: ["stanford", "harvard", "yale", "princeton", "berkeley", "mit", "michigan", "cornell", "columbia", "uchicago", "penn", "dartmouth", "brown", "caltech", "duke", "northwestern", "hopkins", "virginia", "georgetown", "ucla"] },
      { year: 1988, order: ["harvard", "stanford", "yale", "princeton", "mit", "berkeley", "cornell", "michigan", "columbia", "dartmouth", "uchicago", "penn", "brown", "duke", "caltech", "northwestern", "hopkins", "virginia", "georgetown", "ucla"] },
      { year: 1995, order: ["harvard", "princeton", "yale", "stanford", "mit", "duke", "penn", "dartmouth", "columbia", "brown", "caltech", "cornell", "uchicago", "northwestern", "hopkins", "berkeley", "georgetown", "virginia", "michigan", "ucla"] },
      { year: 2000, order: ["princeton", "harvard", "yale", "stanford", "caltech", "mit", "duke", "penn", "dartmouth", "columbia", "cornell", "uchicago", "northwestern", "brown", "hopkins", "rice", "berkeley", "virginia", "georgetown", "ucla"] },
      { year: 2005, order: ["harvard", "princeton", "yale", "penn", "duke", "stanford", "caltech", "mit", "columbia", "dartmouth", "cornell", "washu", "northwestern", "brown", "hopkins", "uchicago", "rice", "vanderbilt", "notreDame", "berkeley"] },
      { year: 2010, order: ["harvard", "princeton", "yale", "columbia", "stanford", "penn", "caltech", "mit", "dartmouth", "duke", "uchicago", "northwestern", "hopkins", "cornell", "brown", "rice", "vanderbilt", "notreDame", "emory", "berkeley"] },
      { year: 2015, order: ["princeton", "harvard", "yale", "columbia", "stanford", "uchicago", "mit", "duke", "penn", "caltech", "hopkins", "dartmouth", "northwestern", "brown", "cornell", "vanderbilt", "rice", "notreDame", "berkeley", "ucla"] },
      { year: 2020, order: ["princeton", "harvard", "columbia", "mit", "yale", "stanford", "uchicago", "penn", "northwestern", "duke", "hopkins", "caltech", "dartmouth", "brown", "vanderbilt", "rice", "cornell", "notreDame", "ucla", "washu"] },
      { year: 2025, order: ["princeton", "mit", "harvard", "stanford", "yale", "caltech", "duke", "hopkins", "northwestern", "penn", "cornell", "uchicago", "brown", "columbia", "dartmouth", "ucla", "berkeley", "rice", "notreDame", "vanderbilt"] }
    ];

COLLEGES.washu = { name: "WashU", color: "#c49c94", admit: 12, grad: 94 };

const historicalTuitionFees: Record<CollegeKey, Partial<Record<number, number>>> = {
      princeton: { 1986: 11780, 1987: 12544, 1988: 13380, 1989: 14390, 1990: 15440, 1991: 16570, 1992: 17750, 1993: 18940, 1994: 19900, 1995: 20960, 1996: 22000, 1997: 22920, 1998: 23820, 1999: 24630, 2000: 25430, 2001: 26160, 2002: 27230, 2003: 28540, 2004: 29910, 2005: 31450, 2006: 33000, 2007: 33000, 2008: 34290, 2009: 35340, 2010: 36640, 2011: 37865, 2012: 39537, 2013: 40170, 2014: 41820, 2015: 43450, 2016: 45300, 2017: 47140, 2018: 50340, 2019: 52800, 2020: 48502, 2021: 56010 },
      mit: { 1986: 12076, 1987: 12800, 1988: 13400, 1989: 14500, 1990: 15600, 1991: 16900, 1992: 18000, 1993: 19000, 1994: 20100, 1995: 21000, 1996: 22000, 1997: 23100, 1998: 24050, 1999: 25000, 2000: 26746, 2001: 27728, 2002: 29130, 2003: 31040, 2004: 32240, 2005: 33740, 2006: 35040, 2007: 36426, 2008: 37960, 2009: 37782, 2010: 39212, 2011: 40732, 2012: 42050, 2013: 43498, 2014: 45016, 2015: 46704, 2016: 48452, 2017: 49892, 2018: 51832, 2019: 53790, 2020: 53450, 2021: 55878 },
      harvard: { 1986: 11390, 1987: 11776, 1988: 12715, 1989: 13545, 1990: 14450, 1991: 15410, 1992: 16454, 1993: 17470, 1994: 18485, 1995: 19472, 1996: 20424, 1997: 21266, 1998: 22028, 1999: 24407, 2000: 25128, 2001: 26019, 2002: 27448, 2003: 29060, 2004: 30620, 2005: 32097, 2006: 33709, 2007: 34998, 2008: 36173, 2009: 37012, 2010: 38415, 2011: 39851, 2012: 40866, 2013: 42292, 2014: 43938, 2015: 45278, 2016: 47074, 2017: 48949, 2018: 50420, 2019: 51925, 2020: 53968, 2021: 55587 },
      stanford: { 1986: 11208, 1987: 11776, 1988: 12636, 1989: 13648, 1990: 14365, 1991: 15201, 1992: 16635, 1993: 17874, 1995: 19695, 1996: 20490, 1998: 22110, 1999: 23229, 2000: 24622, 2001: 26126, 2002: 27443, 2003: 28832, 2004: 30103, 2005: 31452, 2006: 33264, 2007: 35089, 2008: 36360, 2009: 38238, 2010: 40172, 2011: 41564, 2012: 42225, 2013: 43683, 2014: 44757, 2015: 46320, 2016: 47940, 2017: 49617, 2018: 51354, 2019: 53529, 2020: 56169, 2021: 56169 },
      yale: { 1986: 11560, 1987: 12288, 1988: 13230, 1989: 14000, 1990: 15180, 1991: 16300, 1992: 17500, 1993: 18630, 1994: 19840, 1995: 21000, 1996: 22200, 1997: 23100, 1998: 23780, 1999: 24500, 2000: 25220, 2001: 26100, 2002: 27130, 2003: 28400, 2004: 29820, 2005: 31460, 2006: 33030, 2007: 34530, 2008: 35300, 2009: 36500, 2010: 38300, 2011: 40500, 2012: 42300, 2013: 44000, 2014: 45800, 2015: 47600, 2016: 49480, 2017: 51400, 2018: 53430, 2019: 55500, 2020: 57700, 2021: 59950 },
      caltech: { 1986: 10599, 1987: 11008, 1988: 11709, 1989: 12409, 1990: 13415, 1991: 14230, 1992: 15080, 1993: 16030, 1994: 16695, 1995: 17370, 1996: 18000, 1997: 18736, 1998: 19166, 1999: 19476, 2000: 19959, 2001: 21120, 2002: 22119, 2003: 24117, 2004: 25566, 2005: 27309, 2006: 31416, 2007: 32835, 2008: 34515, 2009: 34584, 2010: 36282, 2011: 37704, 2012: 39588, 2013: 41538, 2014: 43362, 2015: 45390, 2016: 47577, 2017: 49908, 2018: 52362, 2019: 54600, 2020: 56862, 2021: 58680 },
      duke: { 1986: 9180, 1987: 9984, 1988: 10918, 1989: 13148, 1990: 14222, 1991: 15102, 1992: 16236, 1993: 17163, 1994: 19078, 1995: 19996, 1996: 21024, 1997: 22173, 1998: 23864, 1999: 24751, 2000: 25630, 2001: 26768, 2002: 27844, 2003: 29345, 2004: 30720, 2005: 32409, 2006: 33963, 2007: 35512, 2008: 37295, 2009: 38741, 2010: 40243, 2011: 41938, 2012: 43623, 2013: 45376, 2014: 47243, 2015: 49241, 2016: 51265, 2017: 53500, 2018: 55695, 2019: 57931, 2020: 57633, 2021: 60244 },
      hopkins: { 1986: 10500, 1987: 11264, 1988: 12340, 1989: 14360, 1990: 15380, 1991: 16400, 1992: 17420, 1993: 17900, 1994: 18800, 1995: 19750, 1996: 20740, 1997: 21700, 1998: 22680, 1999: 23660, 2000: 24930, 2001: 26210, 2002: 27390, 2003: 28730, 2004: 30140, 2005: 31620, 2006: 33900, 2007: 35900, 2008: 37700, 2009: 39150, 2010: 40680, 2011: 42280, 2012: 43390, 2013: 45470, 2014: 47060, 2015: 48710, 2016: 50410, 2017: 52170, 2018: 53740, 2019: 55350, 2020: 54160, 2021: 58720 },
      northwestern: { 1986: 11031, 1987: 11520, 1988: 12270, 1989: 12996, 1990: 13725, 1991: 14370, 1992: 15075, 1993: 15804, 1994: 16404, 1995: 17184, 1996: 18108, 1997: 19152, 1998: 22392, 1999: 23476, 2000: 24714, 2001: 25905, 2002: 27228, 2003: 28524, 2004: 30085, 2005: 31789, 2006: 33567, 2007: 35429, 2008: 37125, 2009: 38838, 2010: 40223, 2011: 41983, 2012: 43779, 2013: 45527, 2014: 47251, 2015: 49047, 2016: 50855, 2017: 52678, 2018: 54568, 2019: 56691, 2020: 58701, 2021: 60768 },
      penn: { 1986: 11200, 1987: 11776, 1988: 12750, 1989: 13950, 1991: 15644, 1992: 16838, 1993: 17838, 1994: 18856, 1995: 19898, 1996: 21130, 1997: 22250, 1998: 23254, 1999: 24230, 2000: 25170, 2001: 26630, 2002: 27988, 2003: 29318, 2004: 30716, 2005: 32364, 2006: 34156, 2007: 35916, 2008: 37526, 2009: 38970, 2010: 40514, 2011: 42098, 2012: 43738, 2013: 45890, 2014: 47668, 2015: 49536, 2016: 51464, 2017: 53534, 2018: 55584, 2019: 57770, 2020: 60042, 2021: 61710 },
      cornell: { 1986: 11500, 1987: 12288, 1988: 13140, 1989: 14040, 1990: 15164, 1991: 16214, 1992: 17276, 1993: 18226, 1994: 19066, 1995: 20066, 1996: 20974, 1997: 21914, 1998: 22868, 1999: 23848, 2000: 24850, 2001: 26062, 2002: 27394, 2003: 28754, 2004: 30167, 2005: 31467, 2006: 32981, 2007: 34781, 2008: 36504, 2009: 37954, 2010: 39666, 2011: 41541, 2012: 43413, 2013: 45358, 2014: 47286, 2015: 49116, 2016: 50953, 2017: 52853, 2018: 55188, 2019: 57222, 2020: 59282, 2021: 61015 },
      uchicago: { 1986: 11521, 1987: 12300, 1988: 13125, 1989: 14025, 1990: 15135, 1991: 16212, 1992: 17376, 1993: 18207, 1994: 19236, 1995: 19875, 1996: 20970, 1997: 22086, 1998: 22902, 1999: 24234, 2000: 25239, 2001: 26475, 2002: 27825, 2003: 29238, 2004: 30729, 2005: 32265, 2006: 34005, 2007: 35868, 2008: 37632, 2009: 39381, 2010: 41091, 2011: 42783, 2012: 44574, 2013: 46386, 2014: 48252, 2015: 50193, 2016: 52491, 2017: 54825, 2018: 57006, 2019: 59298, 2020: 59298, 2021: 60963 },
      brown: { 1986: 11700, 1987: 13056, 1988: 13960, 1989: 15090, 1990: 16114, 1991: 17224, 1992: 18392, 1993: 19556, 1994: 20657, 1995: 21727, 1996: 22719, 1997: 23287, 1998: 23616, 1999: 25186, 2000: 26184, 2001: 27172, 2002: 28480, 2003: 29846, 2004: 31334, 2005: 32974, 2006: 34620, 2007: 36342, 2008: 37718, 2009: 38848, 2010: 40820, 2011: 42230, 2012: 43758, 2013: 45612, 2014: 47434, 2015: 49346, 2016: 51366, 2017: 53419, 2018: 55466, 2019: 58404, 2020: 60584, 2021: 62304 },
      columbia: { 1986: 11318, 1987: 12032, 1989: 13086, 1990: 15191, 1991: 16318, 1992: 16918, 1993: 17948, 1994: 19110, 1995: 20292, 1996: 21444, 1997: 22652, 1998: 23244, 1999: 24974, 2000: 25922, 2001: 26891, 2002: 28385, 2003: 29788, 2004: 31472, 2005: 33246, 2006: 35166, 2007: 37223, 2008: 39326, 2009: 41316, 2010: 43304, 2011: 45290, 2012: 47246, 2013: 49138, 2014: 51008, 2015: 53000, 2016: 49973, 2017: 51640, 2018: 53425, 2019: 60578, 2020: 60532, 2021: 62466 },
      dartmouth: { 1986: 11679, 1987: 12288, 1988: 13335, 1989: 14465, 1990: 15372, 1991: 16230, 1992: 17229, 1993: 18270, 1995: 20805, 1996: 21846, 1997: 23012, 1998: 23910, 1999: 24774, 2000: 25653, 2001: 26562, 2002: 27771, 2003: 29145, 2004: 30465, 2005: 31965, 2006: 33501, 2007: 35178, 2008: 36915, 2009: 38679, 2010: 40437, 2011: 42996, 2012: 45042, 2013: 46752, 2014: 48108, 2015: 49506, 2016: 51438, 2017: 52950, 2018: 55035, 2019: 57204, 2020: 59458, 2021: 60648 },
      ucla: { 1986: 5381, 1987: 5632, 1988: 6297, 1989: 7332, 1990: 7518, 1991: 10034, 1992: 10602, 1993: 11247, 1994: 11592, 1995: 11592, 1996: 12400, 1997: 13034, 1998: 13437, 1999: 13872, 2000: 14315, 2001: 15304, 2002: 16604, 2003: 20030, 2004: 23542, 2005: 24324, 2006: 25206, 2007: 26658, 2008: 28159, 2009: 31628, 2010: 33660, 2011: 35564, 2012: 35570, 2013: 35575, 2014: 35583, 2015: 37471, 2016: 39602, 2017: 41275, 2018: 42218, 2019: 42994, 2020: 43003, 2021: 43012 },
      berkeley: { 1986: 5432, 1987: 5632, 1988: 6038, 1989: 7472, 1990: 8414, 1991: 10377, 1992: 10947, 1993: 11668, 1994: 12045, 1995: 12053, 1996: 12749, 1997: 13338, 1998: 13750, 1999: 14220, 2000: 14661, 2001: 15197, 2002: 16580, 2003: 20068, 2004: 23686, 2005: 23961, 2006: 25338, 2007: 26785, 2008: 28264, 2009: 31715, 2010: 33819, 2011: 35712, 2012: 35752, 2013: 35742, 2014: 35850, 2015: 38139, 2016: 40191, 2017: 42184, 2018: 43176, 2019: 44007, 2020: 44066, 2021: 43980 },
      rice: { 1986: 4620, 1987: 5120, 1988: 5300, 1989: 6100, 1990: 6900, 1991: 7700, 1992: 8500, 1993: 9644, 1994: 10400, 1995: 11122, 1996: 12031, 1997: 13094, 1998: 14131, 1999: 15796, 2000: 15932, 2001: 16834, 2002: 17692, 2003: 18620, 2004: 19719, 2005: 21639, 2006: 24260, 2007: 27138, 2008: 29714, 2009: 31930, 2010: 33771, 2011: 35551, 2012: 37292, 2013: 38941, 2014: 40566, 2015: 42253, 2016: 43918, 2017: 45608, 2018: 47350, 2019: 49112, 2020: 51107, 2021: 52895 },
      notreDame: { 1987: 9472, 1988: 10500, 1989: 11500, 1992: 14650, 1993: 15810, 1994: 16840, 1995: 17830, 1996: 18810, 1997: 19800, 1998: 20900, 1999: 22187, 2000: 23357, 2001: 24497, 2002: 25852, 2003: 27612, 2004: 29512, 2005: 31542, 2006: 33407, 2007: 35187, 2008: 36847, 2009: 38477, 2010: 39919, 2011: 41417, 2012: 42971, 2013: 44605, 2014: 46237, 2015: 47929, 2016: 49685, 2017: 51495, 2018: 53391, 2019: 55553, 2020: 57699, 2021: 58843 },
      vanderbilt: { 1986: 9510, 1987: 10496, 1988: 11739, 1989: 12869, 1990: 13975, 1991: 15325, 1992: 16274, 1993: 16925, 1994: 18149, 1995: 19132, 1996: 20473, 1997: 21467, 1998: 22520, 1999: 23598, 2000: 24712, 2001: 25848, 2002: 27088, 2003: 28440, 2004: 29990, 2005: 31700, 2006: 33440, 2007: 35276, 2008: 37005, 2009: 38578, 2010: 39930, 2011: 41332, 2012: 42118, 2013: 42978, 2014: 43838, 2015: 44712, 2016: 45610, 2017: 47664, 2018: 49816, 2019: 52070, 2020: 54158, 2021: 56966 }
    };

Object.entries(historicalTuitionFees).forEach(([key, values]) => {
  const college = COLLEGES[key];
  if (!college) return;
  college.tuitionFees = { ...values, ...college.tuitionFees };
});

const rankMap = (snapshot: { order: CollegeKey[] }) =>
  new Map(snapshot.order.map((key, index) => [key, index + 1]));

export const interpolateOrder = (year: number): CollegeKey[] => {
  const exact = ANCHOR_SNAPSHOTS.find((snapshot) => snapshot.year === year);
  if (exact) return exact.order.slice(0, 20);

  const previous =
    [...ANCHOR_SNAPSHOTS].reverse().find((snapshot) => snapshot.year < year) ??
    ANCHOR_SNAPSHOTS[0];
  const next =
    ANCHOR_SNAPSHOTS.find((snapshot) => snapshot.year > year) ??
    ANCHOR_SNAPSHOTS[ANCHOR_SNAPSHOTS.length - 1];
  const previousRanks = rankMap(previous);
  const nextRanks = rankMap(next);
  const allKeys = Array.from(new Set([...previous.order, ...next.order]));
  const progress = previous.year === next.year ? 0 : (year - previous.year) / (next.year - previous.year);

  return allKeys
    .map((key) => {
      const fallback = Math.max(previous.order.length, next.order.length) + 4;
      const fromRank = previousRanks.get(key) ?? fallback;
      const toRank = nextRanks.get(key) ?? fallback;
      return {
        key,
        rankPosition: fromRank + (toRank - fromRank) * progress
      };
    })
    .sort((a, b) => a.rankPosition - b.rankPosition || a.key.localeCompare(b.key))
    .slice(0, 20)
    .map((item) => item.key);
};

export const getRankingForYear = (year: number): YearlyRanking => {
  const boundedYear = Math.max(START_YEAR, Math.min(END_YEAR, Math.round(year)));
  const order = interpolateOrder(boundedYear);

  return {
    year: boundedYear,
    entries: order.map((key, index) => {
      const college = COLLEGES[key];
      const tuitionFees = college?.tuitionFees?.[boundedYear] ?? null;
      return {
        key,
        rank: index + 1,
        name: college?.name ?? key,
        color: college?.color ?? '#27c7bd',
        tuitionFees,
        acceptanceRate: college?.admit ?? null,
        graduationRate: college?.grad ?? null,
        hasTuition: tuitionFees !== null,
        visualValue: tuitionFees ?? 4000
      };
    })
  };
};

export const YEARLY_RANKINGS = YEARS.map(getRankingForYear);

export const MAX_TUITION_FEES = Math.max(
  ...YEARLY_RANKINGS.flatMap((ranking) =>
    ranking.entries
      .filter((entry) => entry.tuitionFees !== null)
      .map((entry) => entry.tuitionFees ?? 0)
  )
);
