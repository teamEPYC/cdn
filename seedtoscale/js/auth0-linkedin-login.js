function (accessToken, ctx, cb) {
  //
  // 1) Original /v2/userinfo request (unchanged)
  //
  request.get('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    json: true
  }, function (errUserinfo, resUserinfo, profile) {
    if (errUserinfo) {
      return cb(errUserinfo);
    }
    if (resUserinfo.statusCode !== 200) {
      return cb(new Error('StatusCode: ' + resUserinfo.statusCode));
    }

    // Existing logic: set user_id and nickname
    profile.user_id = profile.sub;
    // NOTE: This sets nickname to the entire `profile` object right now
    profile.nickname = JSON.stringify(profile);

    //
    // 2) Second request: /v2/me
    //
    request.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      json: true
    }, function (errMe, resMe, meResponse) {
      if (errMe) {
        return cb(errMe);
      }
      if (resMe.statusCode !== 200) {
        return cb(new Error('StatusCode: ' + resMe.statusCode));
      }

      // Flatten the `/v2/me` response into nickname
      //  - parse current nickname
      let nicknameObj = {};
      try {
        nicknameObj = JSON.parse(profile.nickname);
      } catch (parseErr) {
        // If it fails to parse for some reason, start fresh
        nicknameObj = {};
      }
      nicknameObj.vanityName = meResponse.vanityName;
      // Re-stringify and store
      profile.nickname = JSON.stringify({ ...nicknameObj, ...meResponse, "RESPONSE_LEVEL": "ME_API" });
      // profile.nickname = JSON.stringify({ ...nicknameObj, ...meResponse });

      //
      // 3) Third request: RapidAPI
      //
      // If you need a vanityName for the RapidAPI call, let's pick it from nicknameObj
      if (!nicknameObj.vanityName) {
        // If we don't have a vanityName, skip RapidAPI and just return
        return cb(null, profile);
      }

      // Build RapidAPI URL with vanityName
      const encodedUrl = encodeURIComponent('https://www.linkedin.com/in/' + meResponse.vanityName + '/');
      const rapidApiUrl = 'https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile' +
        '?linkedin_url=' + encodedUrl +
        '&include_skills=false' +
        '&include_certifications=false' +
        '&include_publications=false' +
        '&include_honors=false' +
        '&include_volunteers=false' +
        '&include_projects=false' +
        '&include_patents=false' +
        '&include_courses=false' +
        '&include_organizations=false' +
        '&include_profile_status=false' +
        '&include_company_public_url=false';

      request.get(rapidApiUrl, {
        headers: {
          'x-rapidapi-key': 'fcd71eb40cmsh9bacb92b4eb8d67p110164jsndda0e0ce351e',
          'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com'
        },
        json: true
      }, function (errRapid, resRapid, rapidData) {
        if (errRapid) {
          console.warn('RapidAPI failed, continuing without enhanced data:', errRapid);
          return cb(null, profile);
        }
        if (resRapid.statusCode !== 200) {
          console.warn('RapidAPI returned non-200 status:', resRapid.statusCode);
          return cb(null, profile);
        }

        // Flatten the RapidAPI data into nickname as well
        let nicknameObj2 = {};
        try {
          nicknameObj2 = JSON.parse(profile.nickname);
        } catch (parseErr) {
          nicknameObj2 = {};
        }

        // // Suppose `rapidData` includes { headline, location } etc.
        // // Add them to nicknameObj2
        // if (rapidData.headline) {
        //   nicknameObj2.headline = rapidData.headline;
        // }
        // if (rapidData.location) {
        //   nicknameObj2.location = rapidData.location;
        // }
        // Continue for other relevant fields from `rapidData`...
        // nicknameObj2.someKey = rapidData.someKey;

        // Re-stringify
        const rapidResponse = rapidData.data;
        profile.nickname = JSON.stringify({ ...nicknameObj2, ...rapidResponse, "RESPONSE_LEVEL": "RAPID_API" });

        // Return the final, updated profile
        cb(null, profile);
      });
    });
  });
}
