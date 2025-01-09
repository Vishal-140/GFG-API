const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

module.exports = async (req, res) => {
  // Root route handler (http://localhost:3000/)
  if (req.method === 'GET' && req.url === '/') {
    return res.json({ message: "Welcome to the GFG API!" });
  }

  // Allow cross-origin requests
  cors()(req, res, async () => {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Function to fetch data from GFG profile
    async function fetchGFGProfile(username) {
      const url = `https://auth.geeksforgeeks.org/user/${username}/practice/`;

      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract ranking information
        const globalRank = $("span.educationDetails_head_left_userRankContainer--text_wt81s b").text().trim().split(" ")[0] || "N/A";
        const countryRank = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.educationDetails_head__eNlYv > div.educationDetails_head_left__NkHF5 > div.educationDetails_head_left_userRankContainer__tyT6H > div > a > span").last().text().trim() || "N/A";

        // Other data extraction
        const contestRating = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(5) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x").last().text().trim() || "N/A";
        const codingScore = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(1) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x").eq(0).text().trim() || "0";
        const problemsSolved = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(3) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x").eq(0).text().trim() || "0";
        const submissions = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.heatMapAndLineChart_head__kvZtS > div.heatMapCard_head__QlR7_ > div.heatMapHeader_head__HLQSQ > div.heatMapHeader_head_left__URMdZ").eq(1).text().trim() || "0";

        const school = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.solvedProblemContainer_head__ZyIn0 > div.solvedProblemSection_head__VEUg4 > div.problemNavbar_head__cKSRi > div:nth-child(1) > div").eq(0).text().trim() || "0";
        const basic = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.solvedProblemContainer_head__ZyIn0 > div.solvedProblemSection_head__VEUg4 > div.problemNavbar_head__cKSRi > div.problemNavbar_head_nav__a4K6P.problemNavbar_head_active__i_qqT > div").eq(0).text().trim() || "0";
        const easy = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.solvedProblemContainer_head__ZyIn0 > div.solvedProblemSection_head__VEUg4 > div.problemNavbar_head__cKSRi > div:nth-child(2) > div").eq(0).text().trim() || "0";
        const medium = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.solvedProblemContainer_head__ZyIn0 > div.solvedProblemSection_head__VEUg4 > div.problemNavbar_head__cKSRi > div:nth-child(4) > div").eq(0).text().trim() || "0";
        const hard = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.solvedProblemContainer_head__ZyIn0 > div.solvedProblemSection_head__VEUg4 > div.problemNavbar_head__cKSRi > div:nth-child(5) > div").eq(0).text().trim() || "0";
        const streak = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_left__YzUgU > div.potdContainer_head__7bGe7 > div:nth-child(2) > div > div.toolTip_tooltip_head__U3klv > div.circularProgressBar_head_mid__IKjUN > div.circularProgressBar_head_mid_streakCnt__MFOF1.tooltipped").text().trim() || "0";

        const heatmap = $("#comp > div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div.heatMapAndLineChart_head__kvZtS > div.heatMapCard_head__QlR7_");

        return {
          username,
          globalRank,
          countryRank,
          codingScore,
          codingStats: {
            problemsSolved,
            submissions,
          },
          streak,
          contestRating,
          school,
          basic,
          easy,
          medium,
          hard,
          heatmap,
        };
      } catch (error) {
        console.error("Error fetching GFG profile:", error.message);
        return { error: "Could not fetch data. Check the username or network." };
      }
    }

    const profileData = await fetchGFGProfile(username);
    return res.json(profileData); // Send the profile data as JSON response
  });
};
