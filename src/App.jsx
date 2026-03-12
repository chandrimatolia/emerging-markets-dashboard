import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Cell, Legend, ReferenceLine
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────────────────
const COUNTRIES = [{"country":"Brazil","iso3":"BRA","region":"Latin America","investment_score":63.2,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.5643,"pca_y":0.304,"gdp_growth":2.9,"inflation":9.3,"current_account":-2.8,"fdi_inflows":4.4,"pol_stability":-0.42,"rule_of_law":-0.34,"control_corruption":-0.37,"ext_debt_gni":88,"gross_cap_form":18.1,"unemployment":9.3,"trade_openness":37.2},{"country":"China","iso3":"CHN","region":"East Asia","investment_score":84,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":0.1968,"pca_y":-2.5811,"gdp_growth":3,"inflation":2,"current_account":2.2,"fdi_inflows":1.5,"pol_stability":0,"rule_of_law":0.2,"control_corruption":0,"ext_debt_gni":14.9,"gross_cap_form":42.9,"unemployment":5.5,"trade_openness":37.5},{"country":"India","iso3":"IND","region":"South Asia","investment_score":78.3,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.4322,"pca_y":-1.9228,"gdp_growth":6.8,"inflation":6.7,"current_account":-2,"fdi_inflows":2,"pol_stability":-0.31,"rule_of_law":0.12,"control_corruption":-0.18,"ext_debt_gni":19.5,"gross_cap_form":33.2,"unemployment":7.3,"trade_openness":46.5},{"country":"Indonesia","iso3":"IDN","region":"East Asia","investment_score":75.6,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.091,"pca_y":-1.5089,"gdp_growth":5.3,"inflation":4.2,"current_account":1,"fdi_inflows":2.5,"pol_stability":-0.45,"rule_of_law":0.16,"control_corruption":-0.37,"ext_debt_gni":37.2,"gross_cap_form":30.7,"unemployment":5.9,"trade_openness":43.5},{"country":"Mexico","iso3":"MEX","region":"Latin America","investment_score":70.3,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.3604,"pca_y":-0.7687,"gdp_growth":3.1,"inflation":7.9,"current_account":-1.3,"fdi_inflows":3.1,"pol_stability":-0.51,"rule_of_law":0.04,"control_corruption":-0.47,"ext_debt_gni":54.7,"gross_cap_form":22.6,"unemployment":3.3,"trade_openness":80.1},{"country":"South Africa","iso3":"ZAF","region":"Sub-Saharan Africa","investment_score":63.8,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.7344,"pca_y":2.2066,"gdp_growth":1.9,"inflation":6.9,"current_account":-0.5,"fdi_inflows":1.5,"pol_stability":-0.14,"rule_of_law":0.26,"control_corruption":0.2,"ext_debt_gni":50,"gross_cap_form":14.7,"unemployment":33.5,"trade_openness":63.2},{"country":"Turkey","iso3":"TUR","region":"Europe & CA","investment_score":44.3,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-2.1057,"pca_y":1.2502,"gdp_growth":5.6,"inflation":72.3,"current_account":-5.9,"fdi_inflows":1.1,"pol_stability":-0.93,"rule_of_law":-0.61,"control_corruption":-0.64,"ext_debt_gni":163.5,"gross_cap_form":29.6,"unemployment":10.5,"trade_openness":66.7},{"country":"Poland","iso3":"POL","region":"Europe & CA","investment_score":88.3,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.4986,"pca_y":-0.0056,"gdp_growth":5.5,"inflation":14.4,"current_account":-2.6,"fdi_inflows":2.1,"pol_stability":0.72,"rule_of_law":0.69,"control_corruption":0.49,"ext_debt_gni":72.3,"gross_cap_form":20.7,"unemployment":2.9,"trade_openness":118.7},{"country":"Nigeria","iso3":"NGA","region":"Sub-Saharan Africa","investment_score":54.9,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-2.7313,"pca_y":-1.6767,"gdp_growth":3.3,"inflation":18.8,"current_account":-0.4,"fdi_inflows":1.6,"pol_stability":-0.9,"rule_of_law":-1,"control_corruption":-1.08,"ext_debt_gni":24.8,"gross_cap_form":27.5,"unemployment":4.1,"trade_openness":28},{"country":"Egypt","iso3":"EGY","region":"MENA","investment_score":57.6,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.2898,"pca_y":0.0423,"gdp_growth":6.6,"inflation":8.5,"current_account":-3.3,"fdi_inflows":1.9,"pol_stability":-0.72,"rule_of_law":-0.5,"control_corruption":-0.55,"ext_debt_gni":92.7,"gross_cap_form":14.9,"unemployment":7.4,"trade_openness":43},{"country":"Vietnam","iso3":"VNM","region":"East Asia","investment_score":85.2,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":1.4531,"pca_y":-0.9864,"gdp_growth":8,"inflation":3.1,"current_account":1.4,"fdi_inflows":5,"pol_stability":-0.38,"rule_of_law":0.06,"control_corruption":-0.37,"ext_debt_gni":37.6,"gross_cap_form":26.4,"unemployment":2.3,"trade_openness":185.6},{"country":"Thailand","iso3":"THA","region":"East Asia","investment_score":82.3,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.1059,"pca_y":-0.457,"gdp_growth":2.6,"inflation":6.1,"current_account":-3.4,"fdi_inflows":2.2,"pol_stability":0.11,"rule_of_law":0.55,"control_corruption":-0.09,"ext_debt_gni":38,"gross_cap_form":24.2,"unemployment":1.2,"trade_openness":122},{"country":"Malaysia","iso3":"MYS","region":"East Asia","investment_score":90.7,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.4014,"pca_y":-0.4922,"gdp_growth":8.7,"inflation":3.3,"current_account":3.7,"fdi_inflows":3.5,"pol_stability":0.25,"rule_of_law":0.61,"control_corruption":0.23,"ext_debt_gni":65,"gross_cap_form":21.8,"unemployment":3.8,"trade_openness":129.5},{"country":"Philippines","iso3":"PHL","region":"East Asia","investment_score":76.5,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":0.3482,"pca_y":-1.0973,"gdp_growth":7.6,"inflation":5.8,"current_account":-4.5,"fdi_inflows":2.8,"pol_stability":-0.38,"rule_of_law":0.04,"control_corruption":-0.25,"ext_debt_gni":27,"gross_cap_form":25,"unemployment":5,"trade_openness":72.8},{"country":"Bangladesh","iso3":"BGD","region":"South Asia","investment_score":60.4,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-2.1892,"pca_y":-2.0711,"gdp_growth":7.1,"inflation":6.2,"current_account":-0.8,"fdi_inflows":0.5,"pol_stability":-1.06,"rule_of_law":-0.7,"control_corruption":-0.97,"ext_debt_gni":22.7,"gross_cap_form":30.1,"unemployment":5.1,"trade_openness":41.5},{"country":"Pakistan","iso3":"PAK","region":"South Asia","investment_score":45.8,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-2.8516,"pca_y":-0.1863,"gdp_growth":6,"inflation":12.2,"current_account":-4.7,"fdi_inflows":1,"pol_stability":-1.18,"rule_of_law":-0.86,"control_corruption":-1.14,"ext_debt_gni":83.8,"gross_cap_form":13.2,"unemployment":6.3,"trade_openness":27},{"country":"Kenya","iso3":"KEN","region":"Sub-Saharan Africa","investment_score":57.9,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.5026,"pca_y":-0.5555,"gdp_growth":4.8,"inflation":7.9,"current_account":-5.6,"fdi_inflows":1.8,"pol_stability":-0.82,"rule_of_law":-0.32,"control_corruption":-0.9,"ext_debt_gni":55.6,"gross_cap_form":18.4,"unemployment":5.5,"trade_openness":31.1},{"country":"Ethiopia","iso3":"ETH","region":"Sub-Saharan Africa","investment_score":60,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-2.9878,"pca_y":-2.1788,"gdp_growth":6.4,"inflation":33.5,"current_account":-5.1,"fdi_inflows":2.4,"pol_stability":-1.25,"rule_of_law":-0.67,"control_corruption":-0.71,"ext_debt_gni":28.4,"gross_cap_form":37,"unemployment":3.9,"trade_openness":30},{"country":"Ghana","iso3":"GHA","region":"Sub-Saharan Africa","investment_score":62.3,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.2505,"pca_y":0.5666,"gdp_growth":3.2,"inflation":31.9,"current_account":-2.5,"fdi_inflows":3,"pol_stability":-0.62,"rule_of_law":-0.07,"control_corruption":-0.3,"ext_debt_gni":68.4,"gross_cap_form":15.1,"unemployment":4.9,"trade_openness":74.5},{"country":"Argentina","iso3":"ARG","region":"Latin America","investment_score":47.3,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-1.4599,"pca_y":1.6163,"gdp_growth":5.2,"inflation":72.4,"current_account":0.4,"fdi_inflows":2.6,"pol_stability":-0.74,"rule_of_law":-0.56,"control_corruption":-0.45,"ext_debt_gni":148,"gross_cap_form":17.4,"unemployment":7,"trade_openness":34.8},{"country":"Colombia","iso3":"COL","region":"Latin America","investment_score":67.8,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.2438,"pca_y":-0.2164,"gdp_growth":7.5,"inflation":10.2,"current_account":-5.7,"fdi_inflows":3.5,"pol_stability":-0.75,"rule_of_law":0.01,"control_corruption":-0.33,"ext_debt_gni":55.3,"gross_cap_form":21.4,"unemployment":9.8,"trade_openness":40.8},{"country":"Chile","iso3":"CHL","region":"Latin America","investment_score":92.7,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":3.1503,"pca_y":0.8192,"gdp_growth":2.4,"inflation":7.6,"current_account":-9.4,"fdi_inflows":7.7,"pol_stability":0.4,"rule_of_law":1.09,"control_corruption":1.05,"ext_debt_gni":97,"gross_cap_form":23.5,"unemployment":7.8,"trade_openness":65.3},{"country":"Peru","iso3":"PER","region":"Latin America","investment_score":69.2,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.1637,"pca_y":-0.4141,"gdp_growth":2.7,"inflation":8.5,"current_account":-4,"fdi_inflows":3.9,"pol_stability":-0.41,"rule_of_law":0.02,"control_corruption":-0.48,"ext_debt_gni":49,"gross_cap_form":22.7,"unemployment":6.8,"trade_openness":49.6},{"country":"Ukraine","iso3":"UKR","region":"Europe & CA","investment_score":23.1,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-2.4856,"pca_y":3.2981,"gdp_growth":-29.1,"inflation":20.2,"current_account":10.2,"fdi_inflows":0.3,"pol_stability":-1.23,"rule_of_law":-0.22,"control_corruption":-0.67,"ext_debt_gni":119,"gross_cap_form":12,"unemployment":19.8,"trade_openness":56},{"country":"Kazakhstan","iso3":"KAZ","region":"Europe & CA","investment_score":70.1,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.6892,"pca_y":0.3167,"gdp_growth":3.2,"inflation":14.8,"current_account":3.1,"fdi_inflows":5.7,"pol_stability":-0.37,"rule_of_law":0,"control_corruption":-0.56,"ext_debt_gni":118.3,"gross_cap_form":24,"unemployment":4.9,"trade_openness":78.8},{"country":"Uzbekistan","iso3":"UZB","region":"Europe & CA","investment_score":65.5,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.0657,"pca_y":-0.5746,"gdp_growth":5.7,"inflation":9,"current_account":-6.3,"fdi_inflows":5.2,"pol_stability":-0.83,"rule_of_law":-0.43,"control_corruption":-0.6,"ext_debt_gni":79,"gross_cap_form":25.7,"unemployment":6.5,"trade_openness":71.6},{"country":"Morocco","iso3":"MAR","region":"MENA","investment_score":68.4,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.4641,"pca_y":0.2756,"gdp_growth":1.3,"inflation":6.6,"current_account":-3.7,"fdi_inflows":2.2,"pol_stability":-0.17,"rule_of_law":0.22,"control_corruption":-0.27,"ext_debt_gni":99.3,"gross_cap_form":24.4,"unemployment":8.7,"trade_openness":75.6},{"country":"Tunisia","iso3":"TUN","region":"MENA","investment_score":66.3,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.6803,"pca_y":1.2577,"gdp_growth":2.4,"inflation":8.3,"current_account":-8.6,"fdi_inflows":2.1,"pol_stability":-0.07,"rule_of_law":0.13,"control_corruption":0.01,"ext_debt_gni":108.6,"gross_cap_form":20.4,"unemployment":15.3,"trade_openness":95.3},{"country":"Saudi Arabia","iso3":"SAU","region":"MENA","investment_score":84.6,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":1.4103,"pca_y":-0.9203,"gdp_growth":8.7,"inflation":2.5,"current_account":13.6,"fdi_inflows":1.7,"pol_stability":0.2,"rule_of_law":0.27,"control_corruption":0.28,"ext_debt_gni":103.95,"gross_cap_form":27.4,"unemployment":6.5,"trade_openness":61.4},{"country":"UAE","iso3":"ARE","region":"MENA","investment_score":100,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":4.4982,"pca_y":0.2389,"gdp_growth":7.9,"inflation":4.8,"current_account":13,"fdi_inflows":3,"pol_stability":0.69,"rule_of_law":0.83,"control_corruption":0.93,"ext_debt_gni":103.95,"gross_cap_form":22.2,"unemployment":3.1,"trade_openness":186},{"country":"Czech Republic","iso3":"CZE","region":"Europe & CA","investment_score":96.3,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":3.7744,"pca_y":0.6894,"gdp_growth":2.4,"inflation":15.1,"current_account":-6.3,"fdi_inflows":4.8,"pol_stability":1.13,"rule_of_law":1,"control_corruption":0.95,"ext_debt_gni":120,"gross_cap_form":25.2,"unemployment":2.3,"trade_openness":152},{"country":"Hungary","iso3":"HUN","region":"Europe & CA","investment_score":83.7,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.3846,"pca_y":0.7095,"gdp_growth":4.6,"inflation":14.5,"current_account":-7,"fdi_inflows":4.5,"pol_stability":0.5,"rule_of_law":0.53,"control_corruption":0.06,"ext_debt_gni":141,"gross_cap_form":26.1,"unemployment":3.6,"trade_openness":171.3},{"country":"Romania","iso3":"ROU","region":"Europe & CA","investment_score":74.3,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":1.0409,"pca_y":0.4162,"gdp_growth":4.2,"inflation":13.8,"current_account":-9.3,"fdi_inflows":3.5,"pol_stability":0.39,"rule_of_law":0.17,"control_corruption":-0.28,"ext_debt_gni":133,"gross_cap_form":26.4,"unemployment":5.6,"trade_openness":108},{"country":"Serbia","iso3":"SRB","region":"Europe & CA","investment_score":73.5,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":1.1234,"pca_y":1.1577,"gdp_growth":2.3,"inflation":11.9,"current_account":-6.9,"fdi_inflows":7,"pol_stability":-0.01,"rule_of_law":0.04,"control_corruption":-0.14,"ext_debt_gni":102.2,"gross_cap_form":17.5,"unemployment":9.2,"trade_openness":117.3},{"country":"Costa Rica","iso3":"CRI","region":"Latin America","investment_score":87.8,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.4873,"pca_y":0.4281,"gdp_growth":4.3,"inflation":8.8,"current_account":-4.5,"fdi_inflows":5.4,"pol_stability":0.54,"rule_of_law":0.67,"control_corruption":0.55,"ext_debt_gni":68.3,"gross_cap_form":20.9,"unemployment":8.9,"trade_openness":68},{"country":"Uruguay","iso3":"URY","region":"Latin America","investment_score":92.2,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":3.0537,"pca_y":0.3385,"gdp_growth":4.9,"inflation":8.4,"current_account":-2.4,"fdi_inflows":4.1,"pol_stability":0.62,"rule_of_law":0.78,"control_corruption":1.29,"ext_debt_gni":75.5,"gross_cap_form":21.1,"unemployment":7.7,"trade_openness":55},{"country":"Tanzania","iso3":"TZA","region":"Sub-Saharan Africa","investment_score":68.9,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.5237,"pca_y":-2.3814,"gdp_growth":4.7,"inflation":4.3,"current_account":-4.7,"fdi_inflows":2.4,"pol_stability":-0.78,"rule_of_law":-0.49,"control_corruption":-0.66,"ext_debt_gni":43.6,"gross_cap_form":39.9,"unemployment":2.7,"trade_openness":54.6},{"country":"Senegal","iso3":"SEN","region":"Sub-Saharan Africa","investment_score":67.6,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.3402,"pca_y":-0.5496,"gdp_growth":4.7,"inflation":9.7,"current_account":-9,"fdi_inflows":2.8,"pol_stability":-0.5,"rule_of_law":-0.23,"control_corruption":-0.23,"ext_debt_gni":73.4,"gross_cap_form":27,"unemployment":5.5,"trade_openness":62.3},{"country":"Ivory Coast","iso3":"CIV","region":"Sub-Saharan Africa","investment_score":70.4,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":0.1422,"pca_y":-1.0346,"gdp_growth":7,"inflation":5.2,"current_account":-4.2,"fdi_inflows":2,"pol_stability":-0.48,"rule_of_law":-0.45,"control_corruption":-0.3,"ext_debt_gni":59.3,"gross_cap_form":27.5,"unemployment":2.6,"trade_openness":77.2},{"country":"Sri Lanka","iso3":"LKA","region":"South Asia","investment_score":47.3,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-0.9557,"pca_y":1.3547,"gdp_growth":-7.8,"inflation":46.4,"current_account":-2.8,"fdi_inflows":0.7,"pol_stability":-0.64,"rule_of_law":-0.12,"control_corruption":-0.32,"ext_debt_gni":118.4,"gross_cap_form":21.9,"unemployment":4.8,"trade_openness":56.1},{"country":"Myanmar","iso3":"MMR","region":"East Asia","investment_score":28.9,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-3.9226,"pca_y":-0.0529,"gdp_growth":-18,"inflation":17.5,"current_account":-3,"fdi_inflows":3,"pol_stability":-1.75,"rule_of_law":-1.42,"control_corruption":-1.37,"ext_debt_gni":37.6,"gross_cap_form":21.3,"unemployment":0.4,"trade_openness":40},{"country":"Cambodia","iso3":"KHM","region":"East Asia","investment_score":69.5,"tier":"Tier 2: Moderate Potential","tier_color":"#4A9EFF","pca_x":0.0959,"pca_y":0.3496,"gdp_growth":5.1,"inflation":5.3,"current_account":-40,"fdi_inflows":12.7,"pol_stability":-0.79,"rule_of_law":-0.72,"control_corruption":-0.97,"ext_debt_gni":37.6,"gross_cap_form":21.4,"unemployment":0.6,"trade_openness":152},{"country":"Mongolia","iso3":"MNG","region":"East Asia","investment_score":65.4,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.6954,"pca_y":1.3369,"gdp_growth":3,"inflation":15.1,"current_account":-13.4,"fdi_inflows":10.1,"pol_stability":-0.63,"rule_of_law":-0.22,"control_corruption":-0.73,"ext_debt_gni":241,"gross_cap_form":36.2,"unemployment":4.6,"trade_openness":117},{"country":"Bolivia","iso3":"BOL","region":"Latin America","investment_score":61,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.6071,"pca_y":-1.4079,"gdp_growth":3.5,"inflation":1.8,"current_account":4.4,"fdi_inflows":0.3,"pol_stability":-0.61,"rule_of_law":-0.64,"control_corruption":-0.72,"ext_debt_gni":68.1,"gross_cap_form":27,"unemployment":4.9,"trade_openness":47.6},{"country":"Ecuador","iso3":"ECU","region":"Latin America","investment_score":53.2,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-1.736,"pca_y":-0.3429,"gdp_growth":2.8,"inflation":3.5,"current_account":2.2,"fdi_inflows":1.5,"pol_stability":-0.97,"rule_of_law":-0.64,"control_corruption":-0.81,"ext_debt_gni":139.3,"gross_cap_form":24.3,"unemployment":4.6,"trade_openness":47.9},{"country":"Paraguay","iso3":"PRY","region":"Latin America","investment_score":60.4,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.9891,"pca_y":-0.4556,"gdp_growth":0.2,"inflation":9.8,"current_account":-3.5,"fdi_inflows":1.3,"pol_stability":-0.5,"rule_of_law":-0.44,"control_corruption":-0.74,"ext_debt_gni":49.6,"gross_cap_form":23.4,"unemployment":6.2,"trade_openness":95.7},{"country":"Jordan","iso3":"JOR","region":"MENA","investment_score":71.8,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":0.5248,"pca_y":1.6213,"gdp_growth":2.4,"inflation":4.2,"current_account":-9.6,"fdi_inflows":6.8,"pol_stability":-0.04,"rule_of_law":0.28,"control_corruption":0.17,"ext_debt_gni":117.9,"gross_cap_form":21.3,"unemployment":22.7,"trade_openness":75},{"country":"Lebanon","iso3":"LBN","region":"MENA","investment_score":0,"tier":"Tier 4: High Risk","tier_color":"#FF5A5A","pca_x":-5.5505,"pca_y":4.7333,"gdp_growth":-7.2,"inflation":162,"current_account":-19.3,"fdi_inflows":0.2,"pol_stability":-2.1,"rule_of_law":-1.14,"control_corruption":-1.28,"ext_debt_gni":103.95,"gross_cap_form":24,"unemployment":29.6,"trade_openness":93.1},{"country":"Azerbaijan","iso3":"AZE","region":"Europe & CA","investment_score":77.5,"tier":"Tier 3: Cautious","tier_color":"#FFB547","pca_x":-0.6362,"pca_y":-1.8325,"gdp_growth":4.6,"inflation":13.9,"current_account":28.3,"fdi_inflows":6.6,"pol_stability":-0.72,"rule_of_law":-0.65,"control_corruption":-0.79,"ext_debt_gni":22.4,"gross_cap_form":29.2,"unemployment":6.8,"trade_openness":109.5},{"country":"Georgia","iso3":"GEO","region":"Europe & CA","investment_score":90.4,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":2.6535,"pca_y":1.02,"gdp_growth":10.1,"inflation":11.9,"current_account":-5.6,"fdi_inflows":8,"pol_stability":0.33,"rule_of_law":0.77,"control_corruption":0.27,"ext_debt_gni":91.4,"gross_cap_form":25.2,"unemployment":18.7,"trade_openness":100.3},{"country":"Armenia","iso3":"ARM","region":"Europe & CA","investment_score":83.2,"tier":"Tier 1: High Potential","tier_color":"#00D4AA","pca_x":1.4293,"pca_y":0.3239,"gdp_growth":12.6,"inflation":8.8,"current_account":-4.1,"fdi_inflows":5,"pol_stability":0.11,"rule_of_law":0.31,"control_corruption":0.06,"ext_debt_gni":71.2,"gross_cap_form":18,"unemployment":13.5,"trade_openness":91.8}];

const TIER_COLORS = {"Tier 1: High Potential":"#00D4AA","Tier 2: Moderate Potential":"#4A9EFF","Tier 3: Cautious":"#FFB547","Tier 4: High Risk":"#FF5A5A"};
const TIER_NAMES = ["Tier 1: High Potential","Tier 2: Moderate Potential","Tier 3: Cautious","Tier 4: High Risk"];
const META = {n_countries:51,n_features:12,pca_variance_pc1:0.3344,pca_variance_pc2:0.1596,ridge_cv_r2:0.9996};
const FEATURE_IMPORTANCE = [{"label":"GDP Growth (%)","coefficient":4.635},{"label":"Political Stability","coefficient":4.507},{"label":"Rule of Law","coefficient":3.906},{"label":"Control of Corruption","coefficient":3.417},{"label":"Inflation Rate (%)","coefficient":-3.385},{"label":"FDI Inflows (% GDP)","coefficient":3.221},{"label":"External Debt (% GNI)","coefficient":-2.577},{"label":"Gross Capital Formation","coefficient":1.994},{"label":"Unemployment Rate (%)","coefficient":-1.967},{"label":"Current Account (% GDP)","coefficient":1.915},{"label":"Trade Openness (% GDP)","coefficient":1.372},{"label":"Mobile per 100 People","coefficient":0.059}];
const REGIONAL = [{"region":"East Asia","avg_score":73.1,"avg_gdp_growth":2.81,"avg_inflation":6.93,"avg_fdi":4.81,"country_count":9},{"region":"Europe & CA","avg_score":72.5,"avg_gdp_growth":2.64,"avg_inflation":18.38,"avg_fdi":4.48,"country_count":12},{"region":"Latin America","avg_score":69.6,"avg_gdp_growth":3.59,"avg_inflation":13.47,"avg_fdi":3.44,"country_count":11},{"region":"MENA","avg_score":64.1,"avg_gdp_growth":3.16,"avg_inflation":28.13,"avg_fdi":2.56,"country_count":7},{"region":"Sub-Saharan Africa","avg_score":63.2,"avg_gdp_growth":4.5,"avg_inflation":14.78,"avg_fdi":2.19,"country_count":8},{"region":"South Asia","avg_score":58,"avg_gdp_growth":3.02,"avg_inflation":17.88,"avg_fdi":1.05,"country_count":4}];
const CORR_LABELS = ["GDP Growth","Inflation","Curr. Acct","FDI Inflows","Pol. Stab.","Rule of Law","Corruption","Ext. Debt","Cap. Form","Unemploymt","Trade Open","Mobile/100","Inv. Score"];
const CORR_MATRIX = [[1,-0.28,-0.04,0.23,0.409,0.288,0.289,-0.138,0.252,-0.237,0.162,0.014,0.634],[-0.28,1,-0.218,-0.234,-0.457,-0.364,-0.293,0.286,-0.052,0.389,-0.058,-0.22,-0.648],[-0.04,-0.218,1,-0.391,0.11,0.1,0.127,-0.133,0.04,-0.069,-0.108,0.134,0.16],[0.23,-0.234,-0.391,1,0.288,0.261,0.207,0.191,0.021,-0.091,0.454,0.219,0.417],[0.409,-0.457,0.11,0.288,1,0.918,0.9,0.126,-0.025,-0.109,0.489,0.537,0.877],[0.288,-0.364,0.1,0.261,0.918,1,0.924,0.127,-0.069,0.045,0.437,0.58,0.801],[0.289,-0.293,0.127,0.207,0.9,0.924,1,0.125,-0.087,0.067,0.348,0.536,0.764],[-0.138,0.286,-0.133,0.191,0.126,0.127,0.125,1,-0.152,0.165,0.21,0.12,-0.145],[0.252,-0.052,0.04,0.021,-0.025,-0.069,-0.087,-0.152,1,-0.319,-0.019,-0.215,0.205],[-0.237,0.389,-0.069,-0.091,-0.109,0.045,0.067,0.165,-0.319,1,-0.129,-0.086,-0.331],[0.162,-0.058,-0.108,0.454,0.489,0.437,0.348,0.21,-0.019,-0.129,1,0.445,0.45],[0.014,-0.22,0.134,0.219,0.537,0.58,0.536,0.12,-0.215,-0.086,0.445,1,0.449],[0.634,-0.648,0.16,0.417,0.877,0.801,0.764,-0.145,0.205,-0.331,0.45,0.449,1]];
const RADAR_FEATURES = ["gdp_growth","inflation","fdi_inflows","pol_stability","rule_of_law","ext_debt_gni","unemployment"];
const RADAR_LABELS = ["GDP Growth","Low Inflation","FDI Inflows","Pol. Stability","Rule of Law","Low Ext.Debt","Low Unemp."];
const GEO = {BRA:[-14,-52],CHN:[35,105],IND:[21,79],IDN:[-2,118],MEX:[24,-102],ZAF:[-30,23],TUR:[39,35],POL:[52,19],NGA:[9,9],EGY:[27,31],VNM:[14,108],THA:[16,101],MYS:[4,109],PHL:[13,122],BGD:[24,90],PAK:[30,69],KEN:[0,38],ETH:[9,40],GHA:[8,-1],ARG:[-38,-63],COL:[5,-74],CHL:[-36,-71],PER:[-9,-75],UKR:[48,31],KAZ:[48,67],UZB:[41,65],MAR:[32,-7],TUN:[34,9],SAU:[24,45],ARE:[24,54],CZE:[50,15],HUN:[47,19],ROU:[46,25],SRB:[44,21],CRI:[10,-84],URY:[-33,-56],TZA:[-6,35],SEN:[14,-14],CIV:[8,-6],LKA:[8,81],MMR:[17,96],KHM:[13,105],MNG:[47,104],BOL:[-17,-65],ECU:[-2,-78],PRY:[-23,-58],JOR:[31,36],LBN:[34,36],AZE:[40,48],GEO:[42,43],ARM:[40,45]};
const AREA_R = {BRA:16,CHN:15,IND:12,IDN:10,MEX:10,ZAF:9,TUR:8,POL:6,NGA:8,EGY:9,VNM:5,THA:6,MYS:6,PHL:5,BGD:4,PAK:9,KEN:7,ETH:9,GHA:5,ARG:13,COL:7,CHL:5,PER:9,UKR:8,KAZ:14,UZB:6,MAR:7,TUN:5,SAU:13,ARE:4,CZE:4,HUN:4,ROU:6,SRB:4,CRI:3,URY:4,TZA:8,SEN:5,CIV:5,LKA:3,MMR:6,KHM:4,MNG:12,BOL:7,ECU:5,PRY:5,JOR:4,LBN:3,AZE:4,GEO:3,ARM:3};

// ── THEME ─────────────────────────────────────────────────────────────────────
const BG="#080C14", PANEL="#0D1525", PANEL2="#111D30", BORDER="rgba(255,255,255,0.07)", MUTED="#6B7A99", TEXT="#E8EDF5";
const fmt = (v,d=1) => (v==null||isNaN(+v))?"—":Number(v).toFixed(d);
const scoreCol = s => s>=80?"#00D4AA":s>=60?"#4A9EFF":s>=40?"#FFB547":"#FF5A5A";
const TT = {contentStyle:{background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:TEXT},labelStyle:{color:TEXT}};
const AX = {tick:{fill:MUTED,fontSize:10},axisLine:{stroke:BORDER},tickLine:{stroke:BORDER}};

// ── CHOROPLETH MAP ────────────────────────────────────────────────────────────
function ChoroplethMap({onSelect}) {
  const [tip, setTip] = useState(null);
  const W=960, H=480;
  const proj = ([lat,lon]) => [((lon+180)/360)*W, ((90-lat)/180)*H];

  // sort big countries behind small ones
  const shapes = COUNTRIES
    .filter(c => GEO[c.iso3])
    .map(c => ({...c, r: AREA_R[c.iso3]||5, pos: proj(GEO[c.iso3])}))
    .sort((a,b) => b.r - a.r);

  return (
    <div style={{position:"relative",background:PANEL,borderRadius:12,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
        {/* Ocean */}
        <defs>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081018"/>
            <stop offset="100%" stopColor="#0A1828"/>
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#oceanGrad)"/>
        {/* Lat/lon grid */}
        {[-60,-30,0,30,60].map(lat => {
          const y=((90-lat)/180)*H;
          return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={lat===0?1:0.5} strokeDasharray={lat===0?"":"4 4"}/>;
        })}
        {[-120,-60,0,60,120].map(lon => {
          const x=((lon+180)/360)*W;
          return <line key={lon} x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="4 4"/>;
        })}
        <text x={8} y={H/2-2} fill="rgba(107,122,153,0.35)" fontSize={8} fontFamily="monospace">0°</text>
        {/* Land background blobs for continents */}
        <ellipse cx={490} cy={175} rx={80} ry={55} fill="#0E1B2A" opacity={0.6}/>
        <ellipse cx={640} cy={185} rx={140} ry={95} fill="#0E1B2A" opacity={0.6}/>
        <ellipse cx={510} cy={295} rx={75} ry={100} fill="#0E1B2A" opacity={0.6}/>
        <ellipse cx={185} cy={185} rx={95} ry={85} fill="#0E1B2A" opacity={0.6}/>
        <ellipse cx={235} cy={335} rx={58} ry={85} fill="#0E1B2A" opacity={0.6}/>
        <ellipse cx={745} cy={350} rx={52} ry={36} fill="#0E1B2A" opacity={0.6}/>

        {/* Country choropleth shapes */}
        {shapes.map(c => {
          const [cx,cy] = c.pos;
          const r = c.r;
          const col = c.tier_color;
          return (
            <g key={c.iso3} style={{cursor:"pointer"}}
              onClick={() => onSelect(c)}
              onMouseEnter={e => setTip({c, mx:e.clientX, my:e.clientY})}
              onMouseLeave={() => setTip(null)}>
              {/* Glow */}
              <ellipse cx={cx} cy={cy} rx={r*1.8} ry={r*1.3} fill={col} opacity={0.08}/>
              {/* Body */}
              <ellipse cx={cx} cy={cy} rx={r*1.25} ry={r*0.9} fill={col} opacity={0.82} stroke={col} strokeWidth={0.8} strokeOpacity={0.5}/>
              {/* Label for larger countries */}
              {r >= 8 && (
                <text x={cx} y={cy+3.5} textAnchor="middle"
                  fill="rgba(0,0,0,0.7)" fontSize={Math.min(8.5,r*0.65)}
                  fontWeight="700" fontFamily="monospace" style={{pointerEvents:"none"}}>
                  {c.iso3}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {tip && (
        <div style={{position:"fixed",left:tip.mx+14,top:tip.my-48,background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"9px 13px",fontSize:12,pointerEvents:"none",zIndex:500,color:TEXT,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
          <div style={{fontWeight:700,marginBottom:2}}>{tip.c.country}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:tip.c.tier_color}}/>
            <span style={{color:tip.c.tier_color,fontSize:11}}>{tip.c.tier.split(":")[0]}</span>
          </div>
          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Score: <strong style={{color:TEXT}}>{tip.c.investment_score}</strong> · {tip.c.region}</div>
        </div>
      )}

      {/* Colour gradient scale */}
      <div style={{position:"absolute",bottom:12,left:12,background:"rgba(8,12,20,0.9)",borderRadius:8,padding:"8px 12px",border:`1px solid ${BORDER}`}}>
        <div style={{fontSize:9,color:MUTED,fontFamily:"monospace",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"}}>Investment Score</div>
        <div style={{display:"flex",height:8,width:140,borderRadius:4,overflow:"hidden",marginBottom:4}}>
          {Array.from({length:28},(_,i)=><div key={i} style={{flex:1,background:scoreCol(i/27*100)}}/>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",width:140}}>
          {["0","25","50","75","100"].map(v=><span key={v} style={{fontSize:8,color:MUTED,fontFamily:"monospace"}}>{v}</span>)}
        </div>
      </div>

      {/* Tier legend */}
      <div style={{position:"absolute",bottom:12,right:12,background:"rgba(8,12,20,0.9)",borderRadius:8,padding:"9px 13px",border:`1px solid ${BORDER}`}}>
        {TIER_NAMES.map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
            <div style={{width:10,height:10,borderRadius:2,background:TIER_COLORS[t],flexShrink:0}}/>
            <span style={{fontSize:9.5,color:MUTED,fontFamily:"monospace"}}>{t.split(":")[0]} <span style={{color:"rgba(107,122,153,0.5)"}}>({COUNTRIES.filter(c=>c.tier===t).length})</span></span>
          </div>
        ))}
        <div style={{fontSize:8,color:"rgba(107,122,153,0.4)",marginTop:4,fontFamily:"monospace"}}>Click any country for details</div>
      </div>
    </div>
  );
}

// ── COUNTRY MODAL ─────────────────────────────────────────────────────────────
function CountryModal({country, onClose}) {
  if (!country) return null;
  const col = country.tier_color;
  const radarData = RADAR_FEATURES.map((f,i) => {
    const v = country[f] ?? 0;
    const maxV = {gdp_growth:15,inflation:170,fdi_inflows:15,pol_stability:3,rule_of_law:2,ext_debt_gni:250,unemployment:35};
    const inv = ["inflation","ext_debt_gni","unemployment"].includes(f);
    let norm = (Math.abs(v)/(maxV[f]||10))*10;
    if (inv) norm = 10-Math.min(10,norm);
    return {label:RADAR_LABELS[i], value:Math.max(0,Math.min(10,+norm.toFixed(1)))};
  });
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:16,width:"100%",maxWidth:800,maxHeight:"88vh",overflowY:"auto",padding:28,position:"relative",boxShadow:"0 32px 80px rgba(0,0,0,0.7)"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.08)",border:"none",color:TEXT,width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:22}}>
          <div style={{position:"relative",width:72,height:72,flexShrink:0}}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5}/>
              <circle cx={36} cy={36} r={30} fill="none" stroke={col} strokeWidth={5}
                strokeDasharray={2*Math.PI*30} strokeDashoffset={2*Math.PI*30*(1-country.investment_score/100)}
                strokeLinecap="round" transform="rotate(-90 36 36)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:col}}>{country.investment_score}</div>
          </div>
          <div>
            <div style={{fontSize:24,fontWeight:700,marginBottom:3}}>{country.country}</div>
            <div style={{fontSize:12,color:MUTED,marginBottom:6}}>{country.region}</div>
            <span style={{background:col+"25",color:col,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:600}}>{country.tier}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(115px,1fr))",gap:10,marginBottom:20}}>
          {[["GDP Growth",fmt(country.gdp_growth)+"%",country.gdp_growth>3?"#00D4AA":country.gdp_growth>=0?TEXT:"#FF5A5A"],
            ["Inflation",fmt(country.inflation)+"%",country.inflation>20?"#FF5A5A":country.inflation>8?"#FFB547":TEXT],
            ["FDI % GDP",fmt(country.fdi_inflows)+"%",TEXT],
            ["Pol. Stability",fmt(country.pol_stability,2),country.pol_stability>0?"#00D4AA":country.pol_stability>-0.5?"#FFB547":"#FF5A5A"],
            ["Rule of Law",fmt(country.rule_of_law,2),TEXT],
            ["Unemployment",fmt(country.unemployment)+"%",country.unemployment>20?"#FF5A5A":country.unemployment>10?"#FFB547":TEXT],
            ["Ext. Debt/GNI",fmt(country.ext_debt_gni)+"%",country.ext_debt_gni>150?"#FF5A5A":country.ext_debt_gni>100?"#FFB547":TEXT],
            ["Current Acct",fmt(country.current_account)+"%",TEXT],
          ].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3,fontFamily:"monospace"}}>{l}</div>
              <div style={{fontSize:16,fontWeight:600,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:MUTED,marginBottom:6,fontStyle:"italic"}}>Radar: normalised feature attractiveness (0–10, higher = more attractive)</div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.07)"/>
            <PolarAngleAxis dataKey="label" tick={{fill:MUTED,fontSize:10}}/>
            <Radar dataKey="value" stroke={col} fill={col} fillOpacity={0.15} strokeWidth={2}/>
            <Tooltip {...TT} formatter={v=>[v,"Score (0–10)"]}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── CORRELATION HEATMAP ───────────────────────────────────────────────────────
function CorrHeatmap() {
  const [hov, setHov] = useState(null);
  const n=CORR_LABELS.length, cell=38, LP=108, TP=16, BP=95, RP=12;
  const W=LP+n*cell+RP, H=TP+n*cell+BP;
  const corrColor = v => {
    if (v>=0) return `rgb(${Math.round(18+34*v)},${Math.round(32+175*v)},${Math.round(60+110*v)})`;
    const t=-v; return `rgb(${Math.round(18+237*t)},${Math.round(32+43*t)},${Math.round(60+10*t)})`;
  };
  return (
    <div style={{background:PANEL,borderRadius:12,border:`1px solid ${BORDER}`,overflowX:"auto",position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",minWidth:540,display:"block"}}>
        <rect width={W} height={H} fill={PANEL}/>
        {CORR_LABELS.map((l,i)=>(
          <text key={i} x={LP-5} y={TP+i*cell+cell*0.64} textAnchor="end" fill={MUTED} fontSize={8.5} fontFamily="monospace">{l}</text>
        ))}
        {CORR_LABELS.map((l,j)=>(
          <text key={j} x={LP+j*cell+cell/2} y={TP+n*cell+10} textAnchor="end" fill={MUTED} fontSize={8.5} fontFamily="monospace"
            transform={`rotate(-45,${LP+j*cell+cell/2},${TP+n*cell+10})`}>{l}</text>
        ))}
        {CORR_MATRIX.map((row,i)=>row.map((v,j)=>(
          <g key={`${i}-${j}`}
            onMouseEnter={e=>setHov({i,j,v,mx:e.clientX,my:e.clientY})}
            onMouseLeave={()=>setHov(null)}>
            <rect x={LP+j*cell} y={TP+i*cell} width={cell-1} height={cell-1} fill={corrColor(v)} rx={2}/>
            <text x={LP+j*cell+cell/2} y={TP+i*cell+cell*0.64} textAnchor="middle"
              fill={Math.abs(v)>0.45?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.55)"}
              fontSize={7} fontWeight={Math.abs(v)>0.6?"bold":"normal"} fontFamily="monospace">{v.toFixed(2)}</text>
          </g>
        )))}
        {/* Scale bar */}
        {Array.from({length:24},(_,k)=>{
          const t=k/23, vv=t*2-1;
          return <rect key={k} x={LP+k*((n*cell)/24)} y={TP+n*cell+BP-18} width={(n*cell)/24+1} height={9} fill={corrColor(vv)}/>;
        })}
        <text x={LP} y={TP+n*cell+BP-3} fill={MUTED} fontSize={8} fontFamily="monospace">−1.0 (neg. corr.)</text>
        <text x={LP+n*cell/2} y={TP+n*cell+BP-3} fill={MUTED} fontSize={8} textAnchor="middle" fontFamily="monospace">0</text>
        <text x={LP+n*cell} y={TP+n*cell+BP-3} fill={MUTED} fontSize={8} textAnchor="end" fontFamily="monospace">+1.0 (pos. corr.)</text>
      </svg>
      {hov && (
        <div style={{position:"fixed",left:hov.mx+10,top:hov.my-44,background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"7px 11px",fontSize:11,zIndex:600,pointerEvents:"none",color:TEXT,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
          <strong>{CORR_LABELS[hov.i]}</strong> × <strong>{CORR_LABELS[hov.j]}</strong><br/>
          <span style={{color:hov.v>0.1?"#00D4AA":hov.v<-0.1?"#FF5A5A":MUTED,fontSize:13,fontFamily:"monospace",fontWeight:700}}>r = {hov.v.toFixed(3)}</span>
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("map");
  const [sel, setSel] = useState(null);
  const [sortCol, setSortCol] = useState("investment_score");
  const [sortDir, setSortDir] = useState(-1);
  const [filterTier, setFilterTier] = useState("all");
  const [search, setSearch] = useState("");
  const [radarISO, setRadarISO] = useState("ARE");

  const ranked = useMemo(() => {
    const withRank = [...COUNTRIES].sort((a,b)=>b.investment_score-a.investment_score).map((c,i)=>({...c,rank:i+1}));
    let rows = filterTier!=="all" ? withRank.filter(r=>r.tier===filterTier) : withRank;
    if (search) rows = rows.filter(r=>r.country.toLowerCase().includes(search.toLowerCase()));
    return [...rows].sort((a,b)=>{
      const va=a[sortCol],vb=b[sortCol];
      return typeof va==="string" ? sortDir*va.localeCompare(vb) : sortDir*((va||0)-(vb||0));
    });
  }, [sortCol,sortDir,filterTier,search]);

  const t1 = COUNTRIES.filter(c=>c.tier==="Tier 1: High Potential").length;
  const TABS = [["map","🌍 Map"],["rankings","📊 Rankings"],["clusters","🔬 Clusters"],["features","📈 Features"],["regional","🗺 Regional"],["correlation","🔗 Correlation"],["compare","⚖ Compare"],["quadrant","🎯 Quadrant"],["opportunity","🔭 Opportunity"],["risk","⚠ Risk"],["methodology","⚙ Methodology"]];
  const [cmpA, setCmpA] = useState("VNM");
  const [cmpB, setCmpB] = useState("IND");
  const [qMetric, setQMetric] = useState("pol_stability");
  const [oppHov, setOppHov] = useState(null);
  const [riskHov, setRiskHov] = useState(null);

  const Panel = ({children,pad=20,style={}}) => (
    <div style={{background:PANEL,border:`1px solid ${BORDER}`,borderRadius:12,padding:pad,...style}}>{children}</div>
  );
  const PLabel = ({children}) => (
    <div style={{fontSize:10,color:MUTED,marginBottom:12,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.07em"}}>{children}</div>
  );
  const SecHead = ({n,title,desc}) => (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
        <span style={{fontSize:10,color:"rgba(0,212,170,0.5)",fontFamily:"monospace"}}>{n}</span>
        <span style={{fontSize:19,fontWeight:700,letterSpacing:"-0.015em"}}>{title}</span>
      </div>
      {desc && <p style={{fontSize:13,color:MUTED,margin:0,lineHeight:1.65,maxWidth:800}}>{desc}</p>}
    </div>
  );

  // radar for regional tab
  const radarC = COUNTRIES.find(c=>c.iso3===radarISO);
  const radarData = radarC ? RADAR_FEATURES.map((f,i)=>{
    const v=radarC[f]??0;
    const maxV={gdp_growth:15,inflation:170,fdi_inflows:15,pol_stability:3,rule_of_law:2,ext_debt_gni:250,unemployment:35};
    const inv=["inflation","ext_debt_gni","unemployment"].includes(f);
    let n2=(Math.abs(v)/(maxV[f]||10))*10;
    if(inv) n2=10-Math.min(10,n2);
    return {label:RADAR_LABELS[i],value:Math.max(0,Math.min(10,+n2.toFixed(1)))};
  }) : [];

  return (
    <div style={{background:BG,color:TEXT,minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>

      {/* HEADER */}
      <header style={{padding:"40px 36px 30px",borderBottom:`1px solid ${BORDER}`,background:"linear-gradient(180deg,rgba(0,212,170,0.05) 0%,transparent 100%)"}}>
        <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#00D4AA",marginBottom:10,fontFamily:"monospace",opacity:0.75}}>ML · Data Science · Feature Engineering</div>
        <h1 style={{fontSize:"clamp(22px,3.8vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 12px",lineHeight:1.1,color:TEXT}}>Emerging Markets<br/>Investment Visualiser</h1>
        <p style={{fontSize:13,color:MUTED,maxWidth:660,lineHeight:1.65,margin:"0 0 20px"}}>Machine learning analysis of 51 emerging economies using 12 macroeconomic and governance indicators. KMeans clustering (k=4), Ridge Regression, PCA. Data: World Bank WDI 2022–23 · IMF WEO Apr 2023 · WB WGI 2022.</p>
        <div style={{display:"flex",gap:28,flexWrap:"wrap",marginBottom:18}}>
          {[[51,"Countries"],[12,"Features"],[t1,"Tier 1 Markets","#00D4AA"],[(META.ridge_cv_r2*100).toFixed(1)+"%","Model CV R²","#4A9EFF"]].map(([v,l,c="#00D4AA"])=>(
            <div key={l}><div style={{fontSize:24,fontWeight:700,color:c,fontFamily:"monospace",letterSpacing:"-0.01em"}}>{v}</div><div style={{fontSize:9,color:MUTED,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:1}}>{l}</div></div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {["KMeans (k=4)","Ridge Regression","PCA Projection"].map(b=><span key={b} style={{background:"rgba(0,212,170,0.09)",border:"1px solid rgba(0,212,170,0.22)",borderRadius:4,padding:"3px 10px",fontSize:10,color:"#00D4AA",fontFamily:"monospace"}}>{b}</span>)}
          {["World Bank WDI 2022–23","IMF WEO Apr 2023","WB WGI 2022"].map(b=><span key={b} style={{background:"rgba(74,158,255,0.07)",border:"1px solid rgba(74,158,255,0.18)",borderRadius:4,padding:"3px 10px",fontSize:10,color:"#4A9EFF",fontFamily:"monospace"}}>{b}</span>)}
        </div>
      </header>

      {/* NAV */}
      <nav style={{display:"flex",overflowX:"auto",borderBottom:`1px solid ${BORDER}`,background:"rgba(8,12,20,0.96)",position:"sticky",top:0,zIndex:50}}>
        {TABS.map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"13px 18px",fontFamily:"monospace",fontSize:11,letterSpacing:"0.04em",color:tab===id?"#00D4AA":MUTED,background:"none",border:"none",borderBottom:tab===id?"2px solid #00D4AA":"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s"}}>
            {lbl}
          </button>
        ))}
      </nav>

      <main style={{maxWidth:1340,margin:"0 auto",padding:"32px 24px 80px"}}>

        {/* ── 01 MAP ── */}
        {tab==="map" && (
          <div>
            <SecHead n="01" title="Global Investment Attractiveness Map"
              desc="Choropleth map of all 51 emerging markets. Country shapes are coloured by investment tier and sized proportionally by land area. Hover for a quick summary; click to open a full country profile with radar chart."/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {TIER_NAMES.map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:6,padding:"4px 11px"}}>
                  <div style={{width:9,height:9,borderRadius:2,background:TIER_COLORS[t]}}/>
                  <span style={{fontSize:11,color:TIER_COLORS[t],fontWeight:600}}>{t}</span>
                  <span style={{fontSize:10,color:MUTED}}>({COUNTRIES.filter(c=>c.tier===t).length})</span>
                </div>
              ))}
            </div>
            <ChoroplethMap onSelect={setSel}/>
          </div>
        )}

        {/* ── 02 RANKINGS ── */}
        {tab==="rankings" && (
          <div>
            <SecHead n="02" title="Country Rankings"
              desc="All 51 countries ranked by Investment Attractiveness Score (0–100). Sort by any column. Filter by tier or search by name. Click any row for a full country profile."/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search country…"
                style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${BORDER}`,borderRadius:8,padding:"7px 12px",color:TEXT,fontSize:13,outline:"none",width:200}}/>
              {["all",...TIER_NAMES].map(t=>(
                <button key={t} onClick={()=>setFilterTier(t)}
                  style={{padding:"5px 12px",background:filterTier===t?"rgba(0,212,170,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${filterTier===t?"rgba(0,212,170,0.4)":BORDER}`,borderRadius:6,color:filterTier===t?"#00D4AA":MUTED,fontFamily:"monospace",fontSize:10,cursor:"pointer",transition:"all .15s"}}>
                  {t==="all"?"All":t.split(":")[0]}
                </button>
              ))}
              <span style={{fontSize:11,color:MUTED,marginLeft:"auto"}}>{ranked.length} countries</span>
            </div>
            <Panel pad={0}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      {[["rank","#",44],["country","Country",150],["region","Region",130],["investment_score","Score",130],["tier","Tier",130],["gdp_growth","GDP Growth",100],["inflation","Inflation",100],["fdi_inflows","FDI %GDP",100],["pol_stability","Pol. Stab.",100]].map(([col,lbl,w])=>(
                        <th key={col} onClick={()=>{if(sortCol===col)setSortDir(d=>-d);else{setSortCol(col);setSortDir(-1);}}}
                          style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontFamily:"monospace",letterSpacing:"0.07em",textTransform:"uppercase",color:sortCol===col?"#00D4AA":MUTED,borderBottom:`1px solid ${BORDER}`,background:"rgba(255,255,255,0.02)",cursor:"pointer",whiteSpace:"nowrap",minWidth:w}}>
                          {lbl}{sortCol===col?(sortDir>0?" ↑":" ↓"):""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map(r=>{
                      const col=r.tier_color;
                      return (
                        <tr key={r.iso3} onClick={()=>setSel(r)}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                          style={{cursor:"pointer",transition:"background .1s"}}>
                          <td style={{padding:"8px 14px",fontSize:11,fontFamily:"monospace",color:MUTED,borderBottom:`1px solid ${BORDER}`}}>{r.rank}</td>
                          <td style={{padding:"8px 14px",fontWeight:500,borderBottom:`1px solid ${BORDER}`}}>{r.country}</td>
                          <td style={{padding:"8px 14px",fontSize:11,color:MUTED,borderBottom:`1px solid ${BORDER}`}}>{r.region}</td>
                          <td style={{padding:"8px 14px",borderBottom:`1px solid ${BORDER}`}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{flex:1,height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,minWidth:55,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${r.investment_score}%`,background:col,borderRadius:3,transition:"width .3s"}}/>
                              </div>
                              <span style={{fontSize:11,fontFamily:"monospace",color:col,minWidth:30,textAlign:"right"}}>{r.investment_score}</span>
                            </div>
                          </td>
                          <td style={{padding:"8px 14px",borderBottom:`1px solid ${BORDER}`}}>
                            <span style={{background:col+"22",color:col,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600}}>{r.tier.split(":")[0]}</span>
                          </td>
                          <td style={{padding:"8px 14px",fontSize:11,fontFamily:"monospace",color:r.gdp_growth>4?"#00D4AA":r.gdp_growth>=0?TEXT:"#FF5A5A",borderBottom:`1px solid ${BORDER}`}}>{fmt(r.gdp_growth)}%</td>
                          <td style={{padding:"8px 14px",fontSize:11,fontFamily:"monospace",color:r.inflation>20?"#FF5A5A":r.inflation>8?"#FFB547":TEXT,borderBottom:`1px solid ${BORDER}`}}>{fmt(r.inflation)}%</td>
                          <td style={{padding:"8px 14px",fontSize:11,fontFamily:"monospace",borderBottom:`1px solid ${BORDER}`}}>{fmt(r.fdi_inflows)}%</td>
                          <td style={{padding:"8px 14px",fontSize:11,fontFamily:"monospace",color:r.pol_stability>0?"#00D4AA":r.pol_stability>-0.5?"#FFB547":"#FF5A5A",borderBottom:`1px solid ${BORDER}`}}>{fmt(r.pol_stability,2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ── 03 CLUSTERS ── */}
        {tab==="clusters" && (
          <div>
            <SecHead n="03" title="Governance quality separates high-potential markets from the rest"
              desc={`KMeans (k=4) on 12 standardised features. PC1 (${(META.pca_variance_pc1*100).toFixed(1)}% of variance) tracks institutional quality — rule of law, stability, anti-corruption. PC2 (${(META.pca_variance_pc2*100).toFixed(1)}%) tracks growth and debt dynamics.`}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <Panel>
                {/* Editorial headline */}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:3}}>Strong institutions cluster to the right — weak ones to the left</div>
                  <div style={{fontSize:11,color:MUTED}}>Each dot is one country. Colour = investment tier.</div>
                </div>
                {/* Inline tier legend */}
                <div style={{display:"flex",gap:14,marginBottom:10,flexWrap:"wrap"}}>
                  {TIER_NAMES.map(t=>(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:TIER_COLORS[t]}}/>
                      <span style={{fontSize:10,color:MUTED}}>{t.split(":")[0]}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={360}>
                  <ScatterChart margin={{left:10,right:60,top:10,bottom:30}}>
                    <CartesianGrid strokeDasharray="" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                    <XAxis dataKey="x" type="number" domain={["auto","auto"]}
                      tick={{fill:MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}
                      label={{value:`← Weak governance   |   Strong governance →`,position:"insideBottom",offset:-18,fill:MUTED,fontSize:10}}/>
                    <YAxis dataKey="y" type="number" domain={["auto","auto"]}
                      tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}
                      label={{value:"Growth/debt axis →",angle:-90,position:"insideLeft",offset:10,fill:MUTED,fontSize:10}}/>
                    <ReferenceLine x={0} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
                    <Tooltip content={({payload})=>{
                      const d=payload?.[0]?.payload; if(!d) return null;
                      return <div style={{...TT.contentStyle}}>
                        <strong>{d.country}</strong>
                        <div style={{color:d.tier_color,fontSize:11,marginTop:2}}>{d.tier}</div>
                        <div style={{color:MUTED,fontSize:11,marginTop:2}}>Investment score: {d.investment_score}</div>
                      </div>;
                    }}/>
                    {TIER_NAMES.map(t=>(
                      <Scatter key={t}
                        data={COUNTRIES.filter(c=>c.tier===t).map(c=>({...c,x:c.pca_x,y:c.pca_y}))}
                        fill={TIER_COLORS[t]} opacity={0.85} r={5}/>
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Outlier callouts below chart */}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6,paddingLeft:10,paddingRight:60}}>
                  {[["LBN","Lebanon","#FF5A5A"],["MMR","Myanmar","#FF5A5A"]].map(([iso,name,c])=>(
                    <span key={iso} style={{fontSize:10,color:c,fontStyle:"italic"}}>◀ {name}</span>
                  ))}
                  {[["UAE","UAE","#00D4AA"],["CZE","Czech Rep.","#00D4AA"]].map(([iso,name,c])=>(
                    <span key={iso} style={{fontSize:10,color:c,fontStyle:"italic"}}>{name} ▶</span>
                  ))}
                </div>
              </Panel>

              <Panel>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:3}}>Every country above 20% inflation scores below 65 — without exception</div>
                  <div style={{fontSize:11,color:MUTED}}>Investment score (0–100) vs inflation rate (%)</div>
                </div>
                <div style={{display:"flex",gap:14,marginBottom:10,flexWrap:"wrap"}}>
                  {TIER_NAMES.map(t=>(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:TIER_COLORS[t]}}/>
                      <span style={{fontSize:10,color:MUTED}}>{t.split(":")[0]}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={360}>
                  <ScatterChart margin={{left:10,right:20,top:10,bottom:30}}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                    <XAxis dataKey="x" type="number" domain={[0,"auto"]}
                      tick={{fill:MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}
                      label={{value:"Inflation rate (%)",position:"insideBottom",offset:-18,fill:MUTED,fontSize:10}}/>
                    <YAxis dataKey="y" type="number" domain={[0,100]}
                      tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}
                      label={{value:"Investment score",angle:-90,position:"insideLeft",offset:10,fill:MUTED,fontSize:10}}/>
                    {/* Threshold annotation */}
                    <ReferenceLine x={20} stroke="rgba(255,90,90,0.35)" strokeDasharray="4 3" strokeWidth={1.5}
                      label={{value:"20% inflation threshold",position:"insideTopRight",fill:"#FF5A5A",fontSize:9,offset:4}}/>
                    <ReferenceLine y={65} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" strokeWidth={1}
                      label={{value:"score = 65",position:"insideTopRight",fill:MUTED,fontSize:9}}/>
                    <Tooltip content={({payload})=>{
                      const d=payload?.[0]?.payload; if(!d) return null;
                      return <div style={{...TT.contentStyle}}>
                        <strong>{d.country}</strong>
                        <div style={{color:MUTED,fontSize:11,marginTop:2}}>Score: {d.investment_score} · Inflation: {fmt(d.inflation)}%</div>
                      </div>;
                    }}/>
                    {TIER_NAMES.map(t=>(
                      <Scatter key={t}
                        data={COUNTRIES.filter(c=>c.tier===t).map(c=>({...c,x:c.inflation,y:c.investment_score}))}
                        fill={TIER_COLORS[t]} opacity={0.85} r={5}/>
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Callout for extreme outliers */}
                <div style={{marginTop:8,fontSize:10,color:MUTED,fontStyle:"italic",paddingLeft:10}}>
                  Far right: <span style={{color:"#FF5A5A"}}>Lebanon (162%)</span> · <span style={{color:"#FF5A5A"}}>Turkey (72%)</span> · <span style={{color:"#FF5A5A"}}>Argentina (72%)</span>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ── 04 FEATURES ── */}
        {tab==="features" && (
          <div>
            <SecHead n="04" title="Governance and growth drive scores — inflation and debt drag them down"
              desc={`Ridge Regression (α=1.0, CV R² = ${META.ridge_cv_r2.toFixed(4)}) on 12 standardised features. Bar length = influence on score. Most countries (${COUNTRIES.filter(c=>c.investment_score>=60).length} of 51) score between 60–100; a tail of 7 score below 50 due to crisis-level inflation or political collapse.`}/>
            <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
              <Panel>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:3}}>Political stability has the same weight as GDP growth</div>
                  <div style={{fontSize:11,color:MUTED}}>Standardised Ridge coefficients — bars are directly comparable across features</div>
                </div>
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={[...FEATURE_IMPORTANCE].sort((a,b)=>a.coefficient-b.coefficient)} layout="vertical"
                    margin={{left:170,right:50,top:5,bottom:5}}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={true} vertical={false}/>
                    <XAxis type="number" tick={{fill:MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false} domain={["auto","auto"]}/>
                    <YAxis type="category" dataKey="label" tick={{fill:MUTED,fontSize:9.5}} width={165} axisLine={false} tickLine={false}/>
                    <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
                    <Tooltip contentStyle={TT.contentStyle} formatter={v=>[v.toFixed(3),"Coefficient"]} labelStyle={{color:TEXT}}/>
                    <Bar dataKey="coefficient" radius={[0,3,3,0]}
                      label={{position:"right",fill:MUTED,fontSize:9,formatter:v=>v>0?`+${v.toFixed(1)}`:v.toFixed(1)}}>
                      {[...FEATURE_IMPORTANCE].sort((a,b)=>a.coefficient-b.coefficient).map((f,i)=>(
                        <Cell key={i} fill={f.coefficient>=0?"#00D4AA":"#FF5A5A"} opacity={0.85}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:3}}>Most markets score 60–80; 7 are in crisis</div>
                  <div style={{fontSize:11,color:MUTED}}>Distribution of investment scores across all 51 countries</div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={Array.from({length:10},(_,i)=>({
                    range:`${i*10}–${(i+1)*10}`,
                    count:COUNTRIES.filter(c=>c.investment_score>=i*10&&c.investment_score<(i+1)*10+(i===9?1:0)).length
                  }))} margin={{left:0,right:10,top:10,bottom:20}}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                    <XAxis dataKey="range" tick={{fill:MUTED,fontSize:9,angle:-30,textAnchor:"end"}} axisLine={{stroke:BORDER}} tickLine={false} height={40}/>
                    <YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={TT.contentStyle} formatter={v=>[v,"countries"]} labelStyle={{color:TEXT}}/>
                    <Bar dataKey="count" radius={[2,2,0,0]}
                      label={{position:"top",fill:MUTED,fontSize:10,formatter:v=>v>0?v:""}}>
                      {Array.from({length:10},(_,i)=><Cell key={i} fill={scoreCol(i*10+5)} opacity={0.85}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Takeaway callouts */}
                <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    ["#00D4AA", `${COUNTRIES.filter(c=>c.investment_score>=80).length} countries score 80+`, "UAE, Czech Rep., Chile, Malaysia lead"],
                    ["#FF5A5A", `${COUNTRIES.filter(c=>c.investment_score<40).length} score below 40`, "Lebanon, Myanmar, Ukraine in crisis"],
                    ["#FFB547", `Median score: ${[...COUNTRIES].sort((a,b)=>a.investment_score-b.investment_score)[25]?.investment_score}`, "Half of all markets are cautious-tier"],
                  ].map(([c,headline,sub])=>(
                    <div key={headline} style={{borderLeft:`3px solid ${c}`,paddingLeft:10}}>
                      <div style={{fontSize:12,fontWeight:600,color:TEXT}}>{headline}</div>
                      <div style={{fontSize:10,color:MUTED,marginTop:2}}>{sub}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ── 05 REGIONAL ── */}
        {tab==="regional" && (
          <div>
            <SecHead n="05" title="East Asia leads on score; Sub-Saharan Africa leads on GDP growth"
              desc="Regional averages mask wide within-region variance. Europe & CA's high average is driven by Czech Republic (96) and Poland (88), not the region as a whole. Select any country to explore its individual profile."/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
              <Panel>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:3}}>Latin America punches above its inflation weight</div>
                  <div style={{fontSize:11,color:MUTED}}>Average investment score by region — hover for detail</div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[...REGIONAL].sort((a,b)=>b.avg_score-a.avg_score)} margin={{left:5,right:10,top:10,bottom:60}}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                    <XAxis dataKey="region" tick={{fill:MUTED,fontSize:10,angle:-30,textAnchor:"end"}} axisLine={{stroke:BORDER}} tickLine={false} height={65}/>
                    <YAxis tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false} domain={[0,90]}/>
                    <Tooltip contentStyle={TT.contentStyle}
                      content={({payload,label})=>{
                        if(!payload?.length) return null;
                        const r=REGIONAL.find(x=>x.region===label);
                        return <div style={{...TT.contentStyle}}>
                          <strong>{label}</strong>
                          <div style={{color:MUTED,fontSize:11,marginTop:4}}>Score: {r?.avg_score.toFixed(1)}</div>
                          <div style={{color:MUTED,fontSize:11}}>GDP growth: {r?.avg_gdp_growth.toFixed(1)}%</div>
                          <div style={{color:r?.avg_inflation>15?"#FF5A5A":MUTED,fontSize:11}}>Inflation: {r?.avg_inflation.toFixed(1)}%</div>
                          <div style={{color:MUTED,fontSize:11}}>{r?.country_count} countries</div>
                        </div>;
                      }}/>
                    <ReferenceLine y={65} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3"
                      label={{value:"avg = 65",position:"insideTopRight",fill:MUTED,fontSize:9}}/>
                    <Bar dataKey="avg_score" radius={[3,3,0,0]}
                      label={{position:"top",fill:TEXT,fontSize:10,formatter:v=>v.toFixed(1)}}>
                      {[...REGIONAL].sort((a,b)=>b.avg_score-a.avg_score).map((r,i)=>(
                        <Cell key={i} fill={r.avg_score>=72?"#00D4AA":r.avg_score>=65?"#4A9EFF":r.avg_score>=58?"#FFB547":"#FF5A5A"} opacity={0.85}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:2}}>Country feature profile</div>
                    <div style={{fontSize:11,color:MUTED}}>Normalised attractiveness, 0–10 per axis</div>
                  </div>
                  <select value={radarISO} onChange={e=>setRadarISO(e.target.value)}
                    style={{background:"rgba(255,255,255,0.07)",border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 8px",color:TEXT,fontSize:11,outline:"none",maxWidth:180}}>
                    {[...COUNTRIES].sort((a,b)=>a.country.localeCompare(b.country)).map(c=>(
                      <option key={c.iso3} value={c.iso3}>{c.country}</option>
                    ))}
                  </select>
                  {radarC && (
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:18,fontWeight:700,color:radarC.tier_color,fontFamily:"monospace"}}>{radarC.investment_score}</div>
                      <div style={{fontSize:9,color:MUTED,fontFamily:"monospace"}}>{radarC.tier.split(":")[0]}</div>
                    </div>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={265}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.07)"/>
                    <PolarAngleAxis dataKey="label" tick={{fill:MUTED,fontSize:9.5}}/>
                    <Radar dataKey="value" stroke={radarC?.tier_color||"#00D4AA"} fill={radarC?.tier_color||"#00D4AA"} fillOpacity={0.15} strokeWidth={2}/>
                    <Tooltip contentStyle={TT.contentStyle} formatter={v=>[v,"Score (0–10)"]}/>
                  </RadarChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <Panel pad={0}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>{["Region","n","Avg Score","GDP Growth","Inflation","FDI %GDP","Top Market"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontFamily:"monospace",letterSpacing:"0.06em",textTransform:"uppercase",color:MUTED,borderBottom:`1px solid ${BORDER}`,background:"rgba(255,255,255,0.02)"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {[...REGIONAL].sort((a,b)=>b.avg_score-a.avg_score).map(r=>{
                    const top=COUNTRIES.filter(c=>c.region===r.region).sort((a,b)=>b.investment_score-a.investment_score)[0];
                    const c=r.avg_score>=72?"#00D4AA":r.avg_score>=65?"#4A9EFF":r.avg_score>=58?"#FFB547":"#FF5A5A";
                    return (
                      <tr key={r.region}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"9px 14px",fontWeight:500,borderBottom:`1px solid ${BORDER}`}}>{r.region}</td>
                        <td style={{padding:"9px 14px",fontFamily:"monospace",fontSize:11,color:MUTED,borderBottom:`1px solid ${BORDER}`}}>{r.country_count}</td>
                        <td style={{padding:"9px 14px",borderBottom:`1px solid ${BORDER}`}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:60,height:4,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                              <div style={{height:"100%",width:`${r.avg_score}%`,background:c,borderRadius:3}}/>
                            </div>
                            <span style={{fontFamily:"monospace",fontSize:11,color:c}}>{r.avg_score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td style={{padding:"9px 14px",fontSize:11,fontFamily:"monospace",color:r.avg_gdp_growth>4?"#00D4AA":TEXT,borderBottom:`1px solid ${BORDER}`}}>{fmt(r.avg_gdp_growth)}%</td>
                        <td style={{padding:"9px 14px",fontSize:11,fontFamily:"monospace",color:r.avg_inflation>20?"#FF5A5A":r.avg_inflation>10?"#FFB547":TEXT,borderBottom:`1px solid ${BORDER}`}}>{fmt(r.avg_inflation)}%</td>
                        <td style={{padding:"9px 14px",fontSize:11,fontFamily:"monospace",borderBottom:`1px solid ${BORDER}`}}>{fmt(r.avg_fdi)}%</td>
                        <td style={{padding:"9px 14px",borderBottom:`1px solid ${BORDER}`}}>
                          <span style={{fontWeight:500}}>{top?.country}</span>
                          <span style={{marginLeft:8,fontSize:10,fontFamily:"monospace",color:top?.tier_color}}>{top?.investment_score}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Panel>
          </div>
        )}

        {/* ── 06 CORRELATION ── */}
        {tab==="correlation" && (
          <div>
            <SecHead n="06" title="Feature Correlation Matrix"
              desc="Pearson correlations between all 12 features and the composite Investment Score. The governance cluster (Political Stability, Rule of Law, Corruption Control) shows the strongest positive correlations with score (+0.88, +0.80, +0.76). Inflation is the strongest negative predictor (r = −0.65). Hover any cell for exact values."/>
            <CorrHeatmap/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginTop:16}}>
              {[["Strongest positive pair","Rule of Law × Pol. Stability","r = +0.918","#00D4AA"],
                ["Strongest with score","GDP Growth × Inv. Score","r = +0.634","#4A9EFF"],
                ["Strongest negative","Inflation × Inv. Score","r = −0.648","#FF5A5A"],
                ["Governance cluster","Pol. Stab. × Corruption","r = +0.900","#00D4AA"]].map(([t,sub,v,c])=>(
                <Panel key={t}>
                  <div style={{fontSize:9,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"monospace",marginBottom:4}}>{t}</div>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:6,color:"#8D9DB8"}}>{sub}</div>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:"monospace",color:c}}>{v}</div>
                </Panel>
              ))}
            </div>
          </div>
        )}

        {/* ── 07 METHODOLOGY ── */}
        {/* ── 08 COMPARE ── */}
        {tab==="compare" && (() => {
          const A = COUNTRIES.find(c=>c.iso3===cmpA);
          const B = COUNTRIES.find(c=>c.iso3===cmpB);
          const CMP_FEATURES = [
            {key:"investment_score", label:"Investment Score", max:100, fmt:(v)=>v.toFixed(1)},
            {key:"gdp_growth",       label:"GDP Growth (%)",  max:15,  fmt:(v)=>v.toFixed(1)+"%"},
            {key:"inflation",        label:"Inflation (%)",   max:80,  fmt:(v)=>v.toFixed(1)+"%", invert:true},
            {key:"pol_stability",    label:"Political Stability", max:2, min:-2.5, fmt:(v)=>v.toFixed(2)},
            {key:"rule_of_law",      label:"Rule of Law",     max:2,   min:-2, fmt:(v)=>v.toFixed(2)},
            {key:"control_corruption",label:"Anti-Corruption",max:2,   min:-2, fmt:(v)=>v.toFixed(2)},
            {key:"fdi_inflows",      label:"FDI Inflows (%GDP)", max:12, fmt:(v)=>v.toFixed(1)+"%"},
            {key:"ext_debt_gni",     label:"Ext. Debt (%GNI)",  max:250,fmt:(v)=>v.toFixed(0)+"%", invert:true},
            {key:"unemployment",     label:"Unemployment (%)",  max:35, fmt:(v)=>v.toFixed(1)+"%", invert:true},
            {key:"trade_openness",   label:"Trade Openness (%GDP)", max:200, fmt:(v)=>v.toFixed(0)+"%"},
            {key:"gross_cap_form",   label:"Capital Formation (%GDP)", max:45, fmt:(v)=>v.toFixed(1)+"%"},
            {key:"current_account",  label:"Current Account (%GDP)", max:30, min:-25, fmt:(v)=>v.toFixed(1)+"%"},
          ];
          // Normalise to 0–100 scale for bar width
          const norm = (key, val) => {
            const f = CMP_FEATURES.find(x=>x.key===key);
            if (!f) return 50;
            const mn = f.min ?? 0;
            const mx = f.max;
            return Math.max(0, Math.min(100, ((val - mn)/(mx - mn))*100));
          };
          // Who wins each feature (higher = better unless invert)
          const winner = (key, va, vb) => {
            const f = CMP_FEATURES.find(x=>x.key===key);
            if (!f || va===vb) return null;
            return f.invert ? (va < vb ? "A" : "B") : (va > vb ? "A" : "B");
          };
          if (!A || !B) return null;
          const aWins = CMP_FEATURES.filter(f=>winner(f.key, A[f.key], B[f.key])==="A").length;
          const bWins = CMP_FEATURES.filter(f=>winner(f.key, A[f.key], B[f.key])==="B").length;
          return (
            <div>
              <SecHead n="07" title="Head-to-head market comparison"
                desc="Select any two markets to see a feature-by-feature breakdown. Bar length = normalised value (0–100 scale). Teal edge = better performer on that indicator."/>

              {/* Country selectors */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",marginBottom:24}}>
                <Panel style={{padding:16}}>
                  <div style={{fontSize:10,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"monospace",marginBottom:8}}>Market A</div>
                  <select value={cmpA} onChange={e=>setCmpA(e.target.value)}
                    style={{width:"100%",background:"rgba(255,255,255,0.07)",border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 10px",color:TEXT,fontSize:13,outline:"none"}}>
                    {[...COUNTRIES].sort((a,b)=>a.country.localeCompare(b.country)).map(c=>(
                      <option key={c.iso3} value={c.iso3}>{c.country}</option>
                    ))}
                  </select>
                  {A && (
                    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:28,fontWeight:700,fontFamily:"monospace",color:A.tier_color}}>{A.investment_score}</div>
                      <div>
                        <div style={{fontSize:11,color:TEXT}}>{A.country}</div>
                        <div style={{fontSize:10,color:A.tier_color}}>{A.tier.split(":")[0]}</div>
                      </div>
                    </div>
                  )}
                </Panel>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11,color:MUTED,marginBottom:6,fontFamily:"monospace"}}>wins</div>
                  <div style={{fontSize:26,fontWeight:700,color:A.tier_color,fontFamily:"monospace"}}>{aWins}</div>
                  <div style={{fontSize:11,color:MUTED,margin:"4px 0",fontFamily:"monospace"}}>vs</div>
                  <div style={{fontSize:26,fontWeight:700,color:B.tier_color,fontFamily:"monospace"}}>{bWins}</div>
                  <div style={{fontSize:11,color:MUTED,marginTop:6,fontFamily:"monospace"}}>wins</div>
                </div>
                <Panel style={{padding:16}}>
                  <div style={{fontSize:10,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"monospace",marginBottom:8}}>Market B</div>
                  <select value={cmpB} onChange={e=>setCmpB(e.target.value)}
                    style={{width:"100%",background:"rgba(255,255,255,0.07)",border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 10px",color:TEXT,fontSize:13,outline:"none"}}>
                    {[...COUNTRIES].sort((a,b)=>a.country.localeCompare(b.country)).map(c=>(
                      <option key={c.iso3} value={c.iso3}>{c.country}</option>
                    ))}
                  </select>
                  {B && (
                    <div style={{marginTop:12,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:28,fontWeight:700,fontFamily:"monospace",color:B.tier_color}}>{B.investment_score}</div>
                      <div>
                        <div style={{fontSize:11,color:TEXT}}>{B.country}</div>
                        <div style={{fontSize:10,color:B.tier_color}}>{B.tier.split(":")[0]}</div>
                      </div>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Dumbbell / diverging bar chart */}
              <Panel pad={0}>
                {/* Header row */}
                <div style={{display:"grid",gridTemplateColumns:"180px 1fr 60px 1fr",gap:0,padding:"10px 16px",borderBottom:`1px solid ${BORDER}`,background:"rgba(255,255,255,0.02)"}}>
                  <div style={{fontSize:10,color:MUTED,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>Indicator</div>
                  <div style={{fontSize:10,color:A.tier_color,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right",paddingRight:8}}>{A?.country}</div>
                  <div></div>
                  <div style={{fontSize:10,color:B.tier_color,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.06em",paddingLeft:8}}>{B?.country}</div>
                </div>
                {CMP_FEATURES.map((f,i) => {
                  const va = A?.[f.key] ?? 0;
                  const vb = B?.[f.key] ?? 0;
                  const na = norm(f.key, va);
                  const nb = norm(f.key, vb);
                  const w = winner(f.key, va, vb);
                  return (
                    <div key={f.key} style={{display:"grid",gridTemplateColumns:"180px 1fr 60px 1fr",gap:0,padding:"8px 16px",borderBottom:i<CMP_FEATURES.length-1?`1px solid ${BORDER}`:"none",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                      {/* Label */}
                      <div style={{fontSize:11,color:w?"#E8EDF5":MUTED,display:"flex",alignItems:"center"}}>{f.label}</div>
                      {/* A bar (right-aligned, grows left) */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6,paddingRight:8}}>
                        <span style={{fontSize:10,fontFamily:"monospace",color:w==="A"?A.tier_color:MUTED,minWidth:40,textAlign:"right"}}>{f.fmt(va)}</span>
                        <div style={{width:120,height:8,display:"flex",justifyContent:"flex-end",background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                          <div style={{width:`${na}%`,background:w==="A"?A.tier_color:"rgba(255,255,255,0.18)",borderRadius:4,transition:"width .4s"}}/>
                        </div>
                      </div>
                      {/* Centre dot */}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:w?BORDER:"rgba(255,255,255,0.15)"}}/>
                      </div>
                      {/* B bar (left-aligned, grows right) */}
                      <div style={{display:"flex",alignItems:"center",gap:6,paddingLeft:8}}>
                        <div style={{width:120,height:8,background:"rgba(255,255,255,0.05)",borderRadius:4,overflow:"hidden"}}>
                          <div style={{width:`${nb}%`,background:w==="B"?B.tier_color:"rgba(255,255,255,0.18)",borderRadius:4,transition:"width .4s"}}/>
                        </div>
                        <span style={{fontSize:10,fontFamily:"monospace",color:w==="B"?B.tier_color:MUTED,minWidth:40}}>{f.fmt(vb)}</span>
                      </div>
                    </div>
                  );
                })}
              </Panel>

              {/* Verdict */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}>
                {[A,B].map((c,ci) => {
                  const other = ci===0?B:A;
                  const wins = CMP_FEATURES.filter(f=>winner(f.key,A[f.key],B[f.key])===(ci===0?"A":"B"));
                  const topWin = wins[0];
                  const strengths = wins.slice(0,3).map(f=>f.label).join(", ");
                  return (
                    <Panel key={c.iso3} style={{borderColor:`${c.tier_color}33`}}>
                      <div style={{fontSize:10,color:c.tier_color,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{c.country} · {c.tier.split(":")[0]}</div>
                      <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:6}}>
                        {aWins===bWins ? "Tied overall" : wins.length > (ci===0?bWins:aWins) ? `Leads on ${wins.length} of ${CMP_FEATURES.length} indicators` : `Trails on ${CMP_FEATURES.length - wins.length} indicators`}
                      </div>
                      <div style={{fontSize:11,color:MUTED,lineHeight:1.65}}>
                        {strengths ? `Stronger on: ${strengths}` : "No clear advantages"}
                      </div>
                      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${BORDER}`,display:"flex",gap:16}}>
                        {[["Score",c.investment_score],["GDP Growth",c.gdp_growth.toFixed(1)+"%"],["Inflation",c.inflation.toFixed(1)+"%"]].map(([l,v])=>(
                          <div key={l}>
                            <div style={{fontSize:9,color:MUTED,textTransform:"uppercase",fontFamily:"monospace",letterSpacing:"0.08em"}}>{l}</div>
                            <div style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:"monospace"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── 09 QUADRANT ── */}
        {tab==="quadrant" && (() => {
          const YMETRICS = [
            {key:"gdp_growth",     label:"GDP Growth (%)",         desc:"Economic momentum"},
            {key:"fdi_inflows",    label:"FDI Inflows (% GDP)",    desc:"Foreign investor confidence"},
            {key:"gross_cap_form", label:"Capital Formation (%GDP)",desc:"Domestic investment activity"},
          ];
          const XMETRIC = {key:"pol_stability", label:"Political Stability", min:-2.5, max:1.5};
          const yM = YMETRICS.find(m=>m.key===qMetric) || YMETRICS[0];

          // Compute quadrant stats
          const median_x = [...COUNTRIES].sort((a,b)=>a.pol_stability-b.pol_stability)[Math.floor(COUNTRIES.length/2)].pol_stability;
          const yVals = COUNTRIES.map(c=>c[yM.key]);
          const median_y = [...yVals].sort((a,b)=>a-b)[Math.floor(yVals.length/2)];
          const xMin = Math.min(...COUNTRIES.map(c=>c.pol_stability)) - 0.2;
          const xMax = Math.max(...COUNTRIES.map(c=>c.pol_stability)) + 0.2;
          const yMin = Math.min(...yVals) - 0.5;
          const yMax = Math.max(...yVals) + 0.5;

          // Quadrant labels
          const Q = c => {
            const x = c.pol_stability > median_x;
            const y = c[yM.key] > median_y;
            if (x && y)  return {id:"TL", label:"High Potential", color:"#00D4AA"};
            if (!x && y) return {id:"TR", label:"Growth Trap",    color:"#FFB547"};
            if (x && !y) return {id:"BL", label:"Stable but Slow",color:"#4A9EFF"};
            return                {id:"BR", label:"High Risk",      color:"#FF5A5A"};
          };

          const quadrantCounts = {TL:0,TR:0,BL:0,BR:0};
          COUNTRIES.forEach(c => quadrantCounts[Q(c).id]++);

          // Notable countries per quadrant
          const notable = {
            TL: COUNTRIES.filter(c=>Q(c).id==="TL").sort((a,b)=>b.investment_score-a.investment_score).slice(0,3).map(c=>c.country),
            TR: COUNTRIES.filter(c=>Q(c).id==="TR").sort((a,b)=>b[yM.key]-a[yM.key]).slice(0,3).map(c=>c.country),
            BL: COUNTRIES.filter(c=>Q(c).id==="BL").sort((a,b)=>b.investment_score-a.investment_score).slice(0,3).map(c=>c.country),
            BR: COUNTRIES.filter(c=>Q(c).id==="BR").sort((a,b)=>b.investment_score-a.investment_score).slice(0,3).map(c=>c.country),
          };

          return (
            <div>
              <SecHead n="08" title="The governance-growth quadrant reveals who is a value trap"
                desc="Growth alone doesn't make a market attractive — it must be paired with political stability. Bottom-right countries show high growth rates but weak institutions. These are the value traps: high headline numbers that mask structural risk."/>

              {/* Y-axis selector */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:MUTED}}>Y-axis:</span>
                {YMETRICS.map(m=>(
                  <button key={m.key} onClick={()=>setQMetric(m.key)}
                    style={{padding:"5px 12px",background:qMetric===m.key?"rgba(0,212,170,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${qMetric===m.key?"rgba(0,212,170,0.4)":BORDER}`,borderRadius:6,color:qMetric===m.key?"#00D4AA":MUTED,fontFamily:"monospace",fontSize:10,cursor:"pointer"}}>
                    {m.label}
                  </button>
                ))}
                <span style={{fontSize:11,color:MUTED,marginLeft:8}}>X-axis: Political Stability (fixed)</span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:18}}>
                {/* Scatter quadrant */}
                <Panel>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:2}}>Political stability (x) vs {yM.label.toLowerCase()} (y)</div>
                    <div style={{fontSize:11,color:MUTED}}>Bubble size = investment score. Dashed lines = median thresholds.</div>
                  </div>
                  <ResponsiveContainer width="100%" height={420}>
                    <ScatterChart margin={{left:10,right:20,top:10,bottom:30}}>
                      <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false}/>
                      <XAxis dataKey="x" type="number" domain={[xMin,xMax]}
                        tick={{fill:MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}
                        label={{value:"← Unstable   Political Stability   Stable →",position:"insideBottom",offset:-18,fill:MUTED,fontSize:10}}/>
                      <YAxis dataKey="y" type="number" domain={[yMin,yMax]}
                        tick={{fill:MUTED,fontSize:10}} axisLine={false} tickLine={false}
                        label={{value:yM.label,angle:-90,position:"insideLeft",offset:10,fill:MUTED,fontSize:10}}/>
                      {/* Quadrant dividers */}
                      <ReferenceLine x={median_x} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 3" strokeWidth={1}
                        label={{value:"median stability",position:"insideTopRight",fill:MUTED,fontSize:9}}/>
                      <ReferenceLine y={median_y} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 3" strokeWidth={1}
                        label={{value:`median ${yM.key.replace(/_/g," ")}`,position:"insideTopRight",fill:MUTED,fontSize:9}}/>
                      <Tooltip content={({payload})=>{
                        const d=payload?.[0]?.payload; if(!d) return null;
                        const q=Q(d);
                        return <div style={{...TT.contentStyle}}>
                          <strong>{d.country}</strong>
                          <div style={{color:q.color,fontSize:11,marginTop:2}}>{q.label}</div>
                          <div style={{color:MUTED,fontSize:11,marginTop:2}}>Score: {d.investment_score}</div>
                          <div style={{color:MUTED,fontSize:11}}>Stability: {fmt(d.pol_stability,2)}</div>
                          <div style={{color:MUTED,fontSize:11}}>{yM.label}: {fmt(d[yM.key],1)}</div>
                        </div>;
                      }}/>
                      {TIER_NAMES.map(t=>(
                        <Scatter key={t}
                          data={COUNTRIES.filter(c=>c.tier===t).map(c=>({
                            ...c, x:c.pol_stability, y:c[yM.key],
                          }))}
                          fill={TIER_COLORS[t]} opacity={0.85}
                          shape={(props)=>{
                            const {cx,cy,payload} = props;
                            const r = 4 + (payload.investment_score/100)*8;
                            return <circle cx={cx} cy={cy} r={r} fill={TIER_COLORS[payload.tier]} opacity={0.8} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5}/>;
                          }}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                  {/* Quadrant corner labels */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
                    {[["#00D4AA","↗ High Potential","Stable + strong growth. Best entry point."],
                      ["#FFB547","↗ Growth Trap","High growth, weak institutions. Proceed with caution."],
                      ["#4A9EFF","↙ Stable but Slow","Good governance, low growth. Defensive play."],
                      ["#FF5A5A","↙ High Risk","Weak on both axes. Avoid or deep discount required."]
                    ].map(([c,l,sub])=>(
                      <div key={l} style={{borderLeft:`3px solid ${c}`,paddingLeft:8}}>
                        <div style={{fontSize:11,fontWeight:600,color:TEXT}}>{l}</div>
                        <div style={{fontSize:10,color:MUTED,marginTop:2,lineHeight:1.4}}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Quadrant breakdown sidebar */}
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {id:"TL",label:"High Potential",  color:"#00D4AA", desc:"Stable + growth"},
                    {id:"TR",label:"Growth Trap",     color:"#FFB547", desc:"Growth, weak governance"},
                    {id:"BL",label:"Stable but Slow", color:"#4A9EFF", desc:"Good governance, low growth"},
                    {id:"BR",label:"High Risk",       color:"#FF5A5A", desc:"Weak on both axes"},
                  ].map(({id,label,color,desc})=>(
                    <Panel key={id} style={{borderColor:`${color}33`,padding:14}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color}}>{label}</div>
                          <div style={{fontSize:10,color:MUTED,marginTop:1}}>{desc}</div>
                        </div>
                        <div style={{fontSize:22,fontWeight:700,color,fontFamily:"monospace"}}>{quadrantCounts[id]}</div>
                      </div>
                      <div style={{fontSize:10,color:MUTED,lineHeight:1.6}}>
                        {notable[id].join(" · ")}
                      </div>
                    </Panel>
                  ))}

                  {/* Key insight callout */}
                  <Panel style={{borderColor:"rgba(255,181,71,0.3)",padding:14}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#FFB547",marginBottom:6}}>Growth Trap watch</div>
                    <div style={{fontSize:11,color:MUTED,lineHeight:1.65}}>
                      {COUNTRIES.filter(c=>Q(c).id==="TR").sort((a,b)=>b[yM.key]-a[yM.key]).slice(0,4).map(c=>(
                        <div key={c.iso3} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{color:TEXT}}>{c.country}</span>
                          <span style={{fontFamily:"monospace",fontSize:10,color:"#FFB547"}}>{fmt(c[yM.key],1)}{yM.key==="gdp_growth"?"%":"%"} growth</span>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,181,71,0.7)",marginTop:8,fontStyle:"italic"}}>High growth + low stability = unrealised potential</div>
                  </Panel>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── OPPORTUNITY MATRIX ── */}
        {tab==="opportunity" && (() => {
          const ragScore = c => c.gdp_growth / Math.sqrt(Math.max(1, c.inflation));
          const maxRAG = Math.max(...COUNTRIES.map(ragScore));
          const minRAG = Math.min(...COUNTRIES.map(ragScore));
          const normRAG = c => ((ragScore(c) - minRAG) / (maxRAG - minRAG)) * 100;
          const X_THRESH = 0, Y_THRESH = 4;
          const SVG_W = 900, SVG_H = 480;
          const PAD = {l:60, r:20, t:36, b:56};
          const plotW = SVG_W - PAD.l - PAD.r;
          const plotH = SVG_H - PAD.t - PAD.b;
          const xMin = -2.3, xMax = 1.6, yMin = -32, yMax = 15;
          const toSvgX = v => PAD.l + ((v - xMin)/(xMax - xMin)) * plotW;
          const toSvgY = v => PAD.t + plotH - ((v - yMin)/(yMax - yMin)) * plotH;
          const xThreshSvg = toSvgX(X_THRESH);
          const yThreshSvg = toSvgY(Y_THRESH);
          const bubbleR = c => Math.max(4, Math.min(18, c.fdi_inflows * 1.8));
          const ALWAYS_LABEL = new Set(["VNM","IND","PHL","IDN","COL","BGD","ETH","MYS","GEO","ARM","CZE","URY","CHL","LBN","MMR","UKR","TUR","ARG","SAU","ARE","POL","BRA","CHN","NGA","PAK"]);
          const quadrant = c => {
            const strong = c.pol_stability >= X_THRESH, fast = c.gdp_growth >= Y_THRESH;
            if ( strong &&  fast) return {id:"NE",label:"Stars",         color:"#00D4AA"};
            if (!strong &&  fast) return {id:"NW",label:"Frontier",      color:"#FFB547"};
            if ( strong && !fast) return {id:"SE",label:"Safe Havens",   color:"#4A9EFF"};
            return                       {id:"SW",label:"Value Traps",   color:"#FF5A5A"};
          };
          const qCounts = {NE:0,NW:0,SE:0,SW:0};
          COUNTRIES.forEach(c => qCounts[quadrant(c).id]++);
          const ragRanked = [...COUNTRIES].sort((a,b) => ragScore(b) - ragScore(a));

          return (
            <div>
              <SecHead n="09" title="Only 10 of 51 markets combine fast growth with stable institutions"
                desc="The Opportunity Matrix maps every market on the two axes that matter most to long-run investors: governance quality (x) and GDP growth rate (y). Bubble size = FDI inflows as % of GDP — a real-world signal of where international capital is already flowing."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18}}>
                <Panel style={{padding:0,overflow:"hidden",position:"relative"}}>
                  <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{width:"100%",display:"block"}}
                    onMouseLeave={()=>setOppHov(null)}>
                    {/* Quadrant shading */}
                    <rect x={xThreshSvg} y={PAD.t} width={SVG_W-xThreshSvg-PAD.r} height={yThreshSvg-PAD.t} fill="rgba(0,212,170,0.07)"/>
                    <rect x={PAD.l} y={PAD.t} width={xThreshSvg-PAD.l} height={yThreshSvg-PAD.t} fill="rgba(255,181,71,0.06)"/>
                    <rect x={xThreshSvg} y={yThreshSvg} width={SVG_W-xThreshSvg-PAD.r} height={SVG_H-yThreshSvg-PAD.b} fill="rgba(74,158,255,0.05)"/>
                    <rect x={PAD.l} y={yThreshSvg} width={xThreshSvg-PAD.l} height={SVG_H-yThreshSvg-PAD.b} fill="rgba(255,90,90,0.06)"/>
                    {/* Corner labels */}
                    <text x={xThreshSvg+10} y={PAD.t+18} fill="#00D4AA" fontSize={11} fontWeight="600" fontFamily="system-ui">★ Stars</text>
                    <text x={PAD.l+10} y={PAD.t+18} fill="#FFB547" fontSize={11} fontWeight="600" fontFamily="system-ui">◆ Frontier</text>
                    <text x={xThreshSvg+10} y={SVG_H-PAD.b-8} fill="#4A9EFF" fontSize={11} fontWeight="600" fontFamily="system-ui">◉ Safe Havens</text>
                    <text x={PAD.l+10} y={SVG_H-PAD.b-8} fill="#FF5A5A" fontSize={11} fontWeight="600" fontFamily="system-ui">✕ Value Traps</text>
                    {/* Grid */}
                    {[-20,-10,0,10].map(v=>{const sy=toSvgY(v);if(sy<PAD.t||sy>SVG_H-PAD.b)return null;return <line key={v} x1={PAD.l} y1={sy} x2={SVG_W-PAD.r} y2={sy} stroke="rgba(255,255,255,0.05)" strokeWidth={v===0?1.5:0.75}/>;
                    })}
                    {/* Dividers */}
                    <line x1={xThreshSvg} y1={PAD.t} x2={xThreshSvg} y2={SVG_H-PAD.b} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeDasharray="5 4"/>
                    <line x1={PAD.l} y1={yThreshSvg} x2={SVG_W-PAD.r} y2={yThreshSvg} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeDasharray="5 4"/>
                    <text x={xThreshSvg+4} y={PAD.t-4} fill="rgba(255,255,255,0.3)" fontSize={8} fontFamily="monospace">stability = 0</text>
                    <text x={PAD.l+4} y={yThreshSvg-4} fill="rgba(255,255,255,0.3)" fontSize={8} fontFamily="monospace">growth = 4%</text>
                    {/* Axes */}
                    {[-20,-10,0,5,10].map(v=>{const sy=toSvgY(v);if(sy<PAD.t||sy>SVG_H-PAD.b)return null;return <text key={v} x={PAD.l-6} y={sy+4} textAnchor="end" fill="rgba(107,122,153,0.8)" fontSize={9} fontFamily="monospace">{v}%</text>;})}
                    {[-2,-1,0,1].map(v=><text key={v} x={toSvgX(v)} y={SVG_H-PAD.b+14} textAnchor="middle" fill="rgba(107,122,153,0.8)" fontSize={9} fontFamily="monospace">{v}</text>)}
                    <text x={PAD.l+plotW/2} y={SVG_H-4} textAnchor="middle" fill="rgba(107,122,153,0.65)" fontSize={10} fontFamily="system-ui">← Weak governance · Political Stability Index · Strong governance →</text>
                    <text x={14} y={PAD.t+plotH/2} textAnchor="middle" fill="rgba(107,122,153,0.65)" fontSize={10} fontFamily="system-ui" transform={`rotate(-90,14,${PAD.t+plotH/2})`}>GDP Growth (%)</text>
                    {/* Bubbles */}
                    {[...COUNTRIES].sort((a,b)=>a.investment_score-b.investment_score).map(c=>{
                      const cx=toSvgX(c.pol_stability), cy=toSvgY(c.gdp_growth), r=bubbleR(c), q=quadrant(c), isHov=oppHov?.iso3===c.iso3;
                      return (
                        <g key={c.iso3} onMouseEnter={e=>setOppHov({...c,mx:e.clientX,my:e.clientY})} onMouseMove={e=>setOppHov(h=>h?{...h,mx:e.clientX,my:e.clientY}:null)} style={{cursor:"pointer"}}>
                          <circle cx={cx} cy={cy} r={r} fill={q.color} opacity={isHov?1:0.72} stroke={isHov?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.25)"} strokeWidth={isHov?1.5:0.5}/>
                          {ALWAYS_LABEL.has(c.iso3)&&<text x={cx} y={cy-r-3} textAnchor="middle" fill="rgba(232,237,245,0.85)" fontSize={8} fontFamily="system-ui" fontWeight="500" style={{pointerEvents:"none"}}>{c.iso3}</text>}
                        </g>
                      );
                    })}
                    {/* Bubble size legend */}
                    <text x={SVG_W-PAD.r-5} y={SVG_H-PAD.b-52} textAnchor="end" fill="rgba(107,122,153,0.55)" fontSize={8} fontFamily="system-ui">Bubble = FDI inflows (% GDP)</text>
                    {[[3,1],[7,4],[13,10]].map(([r,label],i)=>(
                      <g key={i}>
                        <circle cx={SVG_W-PAD.r-15-(i*28)} cy={SVG_H-PAD.b-30} r={r} fill="none" stroke="rgba(107,122,153,0.35)" strokeWidth={1}/>
                        <text x={SVG_W-PAD.r-15-(i*28)} y={SVG_H-PAD.b-12} textAnchor="middle" fill="rgba(107,122,153,0.45)" fontSize={7} fontFamily="monospace">{label}%</text>
                      </g>
                    ))}
                  </svg>
                  {oppHov&&(
                    <div style={{position:"fixed",left:oppHov.mx+14,top:oppHov.my-80,background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",fontSize:12,pointerEvents:"none",zIndex:600,color:TEXT,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
                      <div style={{fontWeight:700,marginBottom:4}}>{oppHov.country} <span style={{fontFamily:"monospace",color:oppHov.tier_color,fontSize:11}}>{oppHov.investment_score}</span></div>
                      <div style={{color:quadrant(oppHov).color,fontSize:11,marginBottom:6}}>{quadrant(oppHov).label}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 16px"}}>
                        {[["GDP growth",oppHov.gdp_growth.toFixed(1)+"%"],["Inflation",oppHov.inflation.toFixed(1)+"%"],["Pol. stability",oppHov.pol_stability.toFixed(2)],["FDI inflows",oppHov.fdi_inflows.toFixed(1)+"% GDP"],["Risk-adj. growth",ragScore(oppHov).toFixed(2)],["Region",oppHov.region]].map(([k,v])=>(
                          <div key={k}><span style={{color:MUTED,fontSize:10}}>{k}: </span><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                </Panel>

                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:12}}>Market breakdown</div>
                    {[["NE","#00D4AA","★ Stars","Strong governance + fast growth"],["NW","#FFB547","◆ Frontier","Fast growth, weak institutions"],["SE","#4A9EFF","◉ Safe Havens","Stable but slow"],["SW","#FF5A5A","✕ Value Traps","Weak on both axes"]].map(([id,c,label,sub])=>(
                      <div key={id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <div style={{fontSize:20,fontWeight:800,fontFamily:"monospace",color:c,minWidth:26}}>{qCounts[id]}</div>
                        <div><div style={{fontSize:11,fontWeight:600,color:c}}>{label}</div><div style={{fontSize:10,color:MUTED}}>{sub}</div></div>
                      </div>
                    ))}
                  </Panel>

                  <Panel style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:4}}>Risk-adjusted growth ranking</div>
                    <div style={{fontSize:10,color:MUTED,marginBottom:12,lineHeight:1.5}}>GDP growth ÷ √inflation — penalises fast-but-hot economies like Turkey</div>
                    {ragRanked.slice(0,12).map((c,i)=>{
                      const rag=ragScore(c), q=quadrant(c);
                      return (
                        <div key={c.iso3} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                          <span style={{fontSize:9,fontFamily:"monospace",color:MUTED,minWidth:16,textAlign:"right"}}>{i+1}</span>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:11,color:TEXT}}>{c.country}</span>
                              <span style={{fontSize:10,fontFamily:"monospace",color:q.color}}>{rag.toFixed(2)}</span>
                            </div>
                            <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
                              <div style={{height:"100%",width:`${normRAG(c)}%`,background:q.color,borderRadius:2}}/>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Panel>

                  <Panel>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:10}}>Key observations</div>
                    {[["#00D4AA","Georgia & Armenia: the hidden stars","Both score 83–90, growing 10–12%, FDI >5% GDP. The strongest risk-adjusted profile in the dataset outside of East Asia."],["#FFB547","Bangladesh & Ethiopia: growth without governance","7%+ GDP growth but pol. stability below −1.0. High potential — if institutions improve."],["#FF5A5A","Turkey: the textbook value trap","5.6% growth sounds attractive. 72% inflation collapses risk-adjusted score to 0.66 — worse than countries with 2% growth."],["#4A9EFF","Chile & Uruguay: the quiet compounders","Strong rule of law, controlled inflation, moderate growth. The best risk-adjusted profile in Latin America."]].map(([c,h,b])=>(
                      <div key={h} style={{borderLeft:`3px solid ${c}`,paddingLeft:10,marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:3}}>{h}</div>
                        <div style={{fontSize:10,color:MUTED,lineHeight:1.55}}>{b}</div>
                      </div>
                    ))}
                  </Panel>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── RISK DASHBOARD ── */}
        {tab==="risk" && (() => {
          const inflationRisk = c => Math.min(100, (c.inflation / 170) * 100);
          const politicalRisk = c => Math.min(100, (Math.max(0, -c.pol_stability) / 2.1) * 100);
          const debtRisk      = c => Math.min(100, (c.ext_debt_gni / 250) * 100);
          const compositeRisk = c => (inflationRisk(c)*0.38 + politicalRisk(c)*0.35 + debtRisk(c)*0.27);
          const sorted = [...COUNTRIES].sort((a,b) => compositeRisk(b) - compositeRisk(a));
          const SVG_W = 900, ROW_H = 22, PAD_TOP = 40, PAD_BOT = 20;
          const SVG_H = PAD_TOP + sorted.length * ROW_H + PAD_BOT;
          const LABEL_W = 112, SCORE_W = 38, GAP = 8;
          const BAR_AREA = SVG_W - LABEL_W - SCORE_W - GAP;
          const BAR_MAX  = BAR_AREA / 3;
          const riskColor = (v, type) => {
            if(type==="inf") return v>60?"#FF5A5A":v>30?"#FFB547":"#4A9EFF";
            if(type==="pol") return v>55?"#FF5A5A":v>25?"#FFB547":"#4A9EFF";
            return                  v>50?"#FF5A5A":v>25?"#FFB547":"#4A9EFF";
          };
          const riskTier = v => v>55?{label:"Critical",color:"#FF5A5A"}:v>35?{label:"Elevated",color:"#FFB547"}:v>18?{label:"Moderate",color:"#4A9EFF"}:{label:"Low",color:"#00D4AA"};

          return (
            <div>
              <SecHead n="10" title="Lebanon, Turkey and Argentina are in crisis for entirely different reasons"
                desc="Three independent stress dimensions — inflation pressure, political fragility, and debt burden — each scored 0–100 and combined into a composite risk index. A single tier label hides the mechanism of failure. Hover any row for exact values."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:18}}>
                <Panel style={{padding:0,overflow:"hidden",position:"relative"}}>
                  {/* Sticky column headers */}
                  <div style={{display:"grid",gridTemplateColumns:`${LABEL_W}px ${SCORE_W}px 1fr 1fr 1fr`,padding:"10px 0 10px 0",borderBottom:`1px solid ${BORDER}`,background:"rgba(13,21,37,0.98)",position:"sticky",top:0,zIndex:10}}>
                    <div style={{fontSize:9,color:MUTED,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.07em",paddingLeft:16}}>Country</div>
                    <div style={{fontSize:9,color:MUTED,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.07em"}}>Risk</div>
                    {[["#FF5A5A","Inflation stress"],["#FFB547","Political fragility"],["#4A9EFF","Debt burden"]].map(([c,l])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:5,paddingLeft:8}}>
                        <div style={{width:8,height:8,borderRadius:2,background:c,opacity:0.85}}/>
                        <span style={{fontSize:9,color:MUTED,fontFamily:"monospace"}}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{overflowY:"auto",maxHeight:720}}>
                    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{width:"100%",display:"block"}}
                      onMouseLeave={()=>setRiskHov(null)}>
                      {/* X axis tick marks at top of each bar section */}
                      {[0,25,50,75,100].map(v=>[0,1,2].map(col=>{
                        const x = LABEL_W+SCORE_W+GAP + col*BAR_MAX + (v/100)*BAR_MAX;
                        return <text key={`${v}-${col}`} x={x} y={PAD_TOP-4} textAnchor="middle" fill="rgba(107,122,153,0.4)" fontSize={7} fontFamily="monospace">{v}</text>;
                      }))}
                      {sorted.map((c,ri)=>{
                        const y=PAD_TOP+ri*ROW_H;
                        const iR=inflationRisk(c), pR=politicalRisk(c), dR=debtRisk(c), cR=compositeRisk(c);
                        const rt=riskTier(cR);
                        const isHov=riskHov?.iso3===c.iso3;
                        return (
                          <g key={c.iso3}
                            onMouseEnter={e=>setRiskHov({...c,iR,pR,dR,cR,mx:e.clientX,my:e.clientY})}
                            onMouseMove={e=>setRiskHov(h=>h?{...h,mx:e.clientX,my:e.clientY}:null)}
                            style={{cursor:"pointer"}}>
                            <rect x={0} y={y} width={SVG_W} height={ROW_H} fill={isHov?"rgba(255,255,255,0.04)":ri%2===0?"rgba(255,255,255,0.01)":"transparent"}/>
                            <text x={LABEL_W-6} y={y+ROW_H*0.67} textAnchor="end" fill={isHov?TEXT:"rgba(232,237,245,0.78)"} fontSize={9.5} fontFamily="system-ui" fontWeight={isHov?"600":"400"}>{c.country}</text>
                            <text x={LABEL_W+SCORE_W-4} y={y+ROW_H*0.67} textAnchor="end" fill={rt.color} fontSize={9} fontFamily="monospace" fontWeight="600">{cR.toFixed(0)}</text>
                            {[[iR,"inf",0],[pR,"pol",1],[dR,"debt",2]].map(([val,type,col])=>{
                              const bx=LABEL_W+SCORE_W+GAP+col*BAR_MAX;
                              const bw=Math.max(0,(val/100)*BAR_MAX*0.9);
                              const fc=riskColor(val,type);
                              return (
                                <g key={col}>
                                  <rect x={bx} y={y+5} width={BAR_MAX-2} height={ROW_H-10} fill="rgba(255,255,255,0.03)" rx={2}/>
                                  <rect x={bx} y={y+5} width={bw} height={ROW_H-10} fill={fc} opacity={0.82} rx={2}/>
                                  {val>12&&<text x={bx+bw+3} y={y+ROW_H*0.67} fill="rgba(255,255,255,0.45)" fontSize={7.5} fontFamily="monospace">{val.toFixed(0)}</text>}
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  {riskHov&&(
                    <div style={{position:"fixed",left:riskHov.mx+14,top:riskHov.my-110,background:PANEL2,border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px 14px",fontSize:12,pointerEvents:"none",zIndex:600,color:TEXT,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
                      <div style={{fontWeight:700,marginBottom:6}}>{riskHov.country} <span style={{color:riskTier(riskHov.cR).color,fontFamily:"monospace",fontSize:10}}>{riskTier(riskHov.cR).label}</span></div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 18px"}}>
                        {[["Composite risk",riskHov.cR.toFixed(1)],["Inflation stress",riskHov.iR.toFixed(1)],["Political fragility",riskHov.pR.toFixed(1)],["Debt burden",riskHov.dR.toFixed(1)],["Inflation",riskHov.inflation.toFixed(1)+"%"],["Pol. stability",riskHov.pol_stability.toFixed(2)],["Ext. debt %GNI",riskHov.ext_debt_gni.toFixed(0)+"%"],["Inv. score",riskHov.investment_score]].map(([k,v])=>(
                          <div key={k}><span style={{color:MUTED,fontSize:10}}>{k}: </span><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                </Panel>

                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Panel>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:12}}>Risk tier distribution</div>
                    {["Critical","Elevated","Moderate","Low"].map(tier=>{
                      const colors={Critical:"#FF5A5A",Elevated:"#FFB547",Moderate:"#4A9EFF",Low:"#00D4AA"};
                      const lo={Critical:55,Elevated:35,Moderate:18,Low:0};
                      const hi={Critical:100,Elevated:55,Moderate:35,Low:18};
                      const count=sorted.filter(c=>{const r=compositeRisk(c);return r>=lo[tier]&&r<hi[tier];}).length;
                      return (
                        <div key={tier} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:3,height:24,background:colors[tier],borderRadius:2}}/>
                            <div>
                              <div style={{fontSize:11,color:colors[tier],fontWeight:600}}>{tier}</div>
                              <div style={{fontSize:9,color:MUTED}}>composite {tier==="Critical"?">55":tier==="Elevated"?"35–55":tier==="Moderate"?"18–35":"<18"}</div>
                            </div>
                          </div>
                          <div style={{fontSize:24,fontWeight:700,fontFamily:"monospace",color:colors[tier]}}>{count}</div>
                        </div>
                      );
                    })}
                  </Panel>
                  <Panel>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:10}}>Three types of crisis</div>
                    {[["#FF5A5A","Inflation-led: Lebanon, Turkey, Argentina","All three inflation-stress scores >80. Different political contexts — same price spiral mechanism destroying real returns."],["#FFB547","Politics-led: Myanmar, Pakistan, Nigeria","Political risk >70 even where inflation is contained. Governance collapse precedes economic failure — the leading indicator."],["#4A9EFF","Debt-led: Mongolia, Sri Lanka, Ukraine","External debt 100–241% GNI. Mongolia is the most extreme case: 241% GNI yet still growing — resource extraction masking structural fragility."]].map(([c,h,b])=>(
                      <div key={h} style={{borderLeft:`3px solid ${c}`,paddingLeft:10,marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:3}}>{h}</div>
                        <div style={{fontSize:10,color:MUTED,lineHeight:1.55}}>{b}</div>
                      </div>
                    ))}
                  </Panel>
                  <Panel>
                    <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:10}}>Counterintuitive findings</div>
                    {[["#00D4AA","Czech Republic: 120% debt, low overall risk","EU-integrated sovereign debt with strong institutions and low inflation. Debt structure and creditor quality matter far more than the headline number."],["#FFB547","Mongolia: the 241% GNI anomaly","Highest external debt in the dataset — yet investment score is 65.4. FDI inflows at 10% GDP signal resource-sector capital masking underlying vulnerability."]].map(([c,h,b])=>(
                      <div key={h} style={{borderLeft:`3px solid ${c}`,paddingLeft:10,marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:600,color:TEXT,marginBottom:3}}>{h}</div>
                        <div style={{fontSize:10,color:MUTED,lineHeight:1.55}}>{b}</div>
                      </div>
                    ))}
                  </Panel>
                </div>
              </div>
            </div>
          );
        })()}


        {tab==="methodology" && (
          <div>
            <SecHead n="11" title="Methodology & Model Details"
              desc="Technical documentation of the full ML pipeline: data sources, feature engineering, clustering, regression and scoring methodology."/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16,marginBottom:24}}>
              {[{ico:"⬡",t:"KMeans Clustering",body:"Countries segmented into 4 investment tiers using KMeans on 12 StandardScaler-normalised features. Cluster labels mapped to tiers by average composite score (highest → Tier 1). k=4 chosen by elbow method on WCSS.",meta:"k=4 · n_init=20 · random_state=42 · scikit-learn"},
                {ico:"◈",t:"Ridge Regression",body:`L2-regularised linear model predicts composite score from standardised features. Coefficients are feature importance proxies. Evaluated with 5-fold CV. Train R² = 0.9999, CV R² = ${META.ridge_cv_r2.toFixed(4)}.`,meta:"alpha=1.0 · 5-fold CV · StandardScaler"},
                {ico:"⊕",t:"PCA Projection",body:`Dimensionality reduction for visualisation. PC1 (${(META.pca_variance_pc1*100).toFixed(1)}%) captures governance/institutional quality; PC2 (${(META.pca_variance_pc2*100).toFixed(1)}%) captures growth dynamics & debt stress.`,meta:`PC1=${(META.pca_variance_pc1*100).toFixed(1)}% · PC2=${(META.pca_variance_pc2*100).toFixed(1)}% · Total=${((META.pca_variance_pc1+META.pca_variance_pc2)*100).toFixed(1)}%`},
                {ico:"⬗",t:"Composite Score (0–100)",body:"Weighted sum of 12 direction-adjusted standardised indicators, linearly rescaled to 0–100. Governance features carry ~36% combined weight. Negative-directional features (inflation, debt, unemployment) are sign-flipped before aggregation.",meta:"12 features · direction-adjusted · linear rescale"},
                {ico:"✦",t:"Feature Engineering",body:"Missing values imputed by regional median (global median fallback). All features standardised (μ=0, σ=1). Governance scores use WB WGI range −2.5 to +2.5. Trade openness = (exports + imports) / GDP.",meta:"Median imputation · StandardScaler · Region-aware"},
                {ico:"↗",t:"Data Sources",body:"World Bank WDI 2022–23 (macro indicators, capital formation, trade). IMF WEO April 2023 (GDP growth, inflation, current account). World Bank WGI 2022 (governance, rule of law, corruption).",meta:"WB WDI · IMF WEO Apr 2023 · WB WGI 2022"},
              ].map(({ico,t,body,meta})=>(
                <Panel key={t} style={{border:`1px solid ${BORDER}`}}>
                  <div style={{fontSize:28,marginBottom:10,lineHeight:1}}>{ico}</div>
                  <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>{t}</div>
                  <div style={{fontSize:12.5,color:"#8D9DB8",lineHeight:1.65,marginBottom:14}}>{body}</div>
                  <div style={{fontFamily:"monospace",fontSize:9.5,color:"#00D4AA",background:"rgba(0,212,170,0.07)",border:"1px solid rgba(0,212,170,0.14)",borderRadius:4,padding:"5px 10px"}}>{meta}</div>
                </Panel>
              ))}
            </div>

            <Panel>
              <PLabel>Feature Definitions & Directional Weights</PLabel>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>{["Feature","Source","Direction","Approx. Weight","Rationale"].map(h=>(
                      <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontFamily:"monospace",letterSpacing:"0.06em",textTransform:"uppercase",color:MUTED,borderBottom:`1px solid ${BORDER}`,background:"rgba(255,255,255,0.02)"}}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[["GDP Per Capita Growth (%)","WB WDI","Positive","14%","Higher growth signals economic momentum"],
                      ["Political Stability Index","WB WGI","Positive","14%","Stability reduces political risk premium"],
                      ["Rule of Law Index","WB WGI","Positive","12%","Legal frameworks protect investor rights"],
                      ["Control of Corruption Index","WB WGI","Positive","10%","Lower corruption → more predictable returns"],
                      ["Inflation Rate (%)","IMF WEO","Negative","10%","High inflation erodes real asset values"],
                      ["FDI Net Inflows (% GDP)","WB WDI","Positive","10%","Signals existing international confidence"],
                      ["External Debt (% GNI)","WB WDI","Negative","8%","High debt raises default & currency risk"],
                      ["Gross Capital Formation (% GDP)","WB WDI","Positive","6%","Domestic investment activity proxy"],
                      ["Current Account Balance (% GDP)","IMF WEO","Positive","6%","External sustainability indicator"],
                      ["Unemployment Rate (%)","WB WDI","Negative","6%","Labour market health & social risk"],
                      ["Trade Openness (% GDP)","WB WDI","Positive","4%","Integration into global supply chains"],
                      ["Mobile Subscriptions per 100","WB WDI","Positive","≈0%","Digital infrastructure proxy (low weight)"],
                    ].map(([f,src,dir,w,rat])=>(
                      <tr key={f} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"7px 14px",fontSize:12,fontWeight:500,borderBottom:`1px solid ${BORDER}`}}>{f}</td>
                        <td style={{padding:"7px 14px",fontSize:10,fontFamily:"monospace",color:MUTED,borderBottom:`1px solid ${BORDER}`}}>{src}</td>
                        <td style={{padding:"7px 14px",fontSize:11,fontFamily:"monospace",color:dir==="Positive"?"#00D4AA":"#FF5A5A",borderBottom:`1px solid ${BORDER}`}}>{dir}</td>
                        <td style={{padding:"7px 14px",fontSize:11,fontFamily:"monospace",color:TEXT,borderBottom:`1px solid ${BORDER}`}}>{w}</td>
                        <td style={{padding:"7px 14px",fontSize:11,color:MUTED,borderBottom:`1px solid ${BORDER}`}}>{rat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Model performance summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14,marginTop:16}}>
              {[["Model","KMeans + Ridge","#00D4AA"],["Countries","51 economies","#4A9EFF"],["Features","12 indicators","#4A9EFF"],["Train R²","0.9999","#00D4AA"],["CV R² (5-fold)",META.ridge_cv_r2.toFixed(4),"#00D4AA"],["PCA Var Explained",`${((META.pca_variance_pc1+META.pca_variance_pc2)*100).toFixed(1)}%`,"#FFB547"]].map(([l,v,c])=>(
                <Panel key={l}>
                  <div style={{fontSize:9,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"monospace",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
                </Panel>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${BORDER}`,padding:"20px 36px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <p style={{fontSize:11,color:MUTED,maxWidth:560,lineHeight:1.6,margin:0}}>
          <strong style={{color:TEXT}}>Data:</strong> World Bank WDI 2022–23 · IMF WEO April 2023 · World Bank WGI 2022.
          Investment scores are model outputs for portfolio demonstration purposes only and do not constitute financial advice.
        </p>
        <p style={{fontSize:10,color:MUTED,fontFamily:"monospace",textAlign:"right",margin:0}}>Python · scikit-learn · Recharts<br/>KMeans + Ridge Regression + PCA</p>
      </footer>

      {/* COUNTRY MODAL */}
      {sel && <CountryModal country={sel} onClose={()=>setSel(null)}/>}
    </div>
  );
}
