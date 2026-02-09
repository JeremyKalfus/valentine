(function attachValentinePages(windowObj) {
  const randomPages = [
    {
      id: "love-rain",
      template: "falling-love",
      title: "Press and hold.",
      subtitle: "Then watch it rain.",
      body: "When you press the button, the page drops the love line in title style across the whole screen.",
      buttonText: "Press to rain text",
      fallingText: "I love you sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo much"
    },
    {
      id: "language-wall",
      template: "language-wall",
      title: "I love you.",
      subtitle: "In every language I can think of.",
      body: "This page fills itself with multilingual I love you lines from the top-right across the whole screen.",
      buttonText: "Another random page",
      languagePhrases: [
        "I love you",
        "Je t'aime",
        "Te quiero",
        "Te amo",
        "Ti amo",
        "Ich liebe dich",
        "Eu te amo",
        "Ik hou van je",
        "Jag alskar dig",
        "Jeg elsker deg",
        "Jeg elsker dig",
        "Kocham cie",
        "Miluji te",
        "Te iubesc",
        "S'agapo",
        "Seni seviyorum",
        "Ana uhibbuka",
        "Ani ohevet otkha",
        "Ya tebya lyublyu",
        "Ya tebe kokhayu",
        "Main tumse pyaar karta hoon",
        "Ami tomake bhalobashi",
        "Wo ai ni",
        "Ai shiteru",
        "Saranghae",
        "Phom rak khun",
        "Toi yeu ban",
        "Aku cinta kamu",
        "Mahal kita",
        "Nakupenda",
        "Ngiyakuthanda"
      ]
    },
    {
      id: "first-text-timer",
      template: "first-text-timer",
      title: "Since your first text to me.",
      subtitle: "November 17, 2025 at 12:21 AM",
      body: "Time that has passed since the moment you texted me.",
      buttonText: "Another random page",
      startLocal: {
        year: 2025,
        month: 11,
        day: 17,
        hour: 0,
        minute: 21,
        second: 0
      },
      firstText: {
        fromRebecca: "hello",
        fromMe: "who's this"
      }
    }
  ];

  function getRandomPage(exceptId) {
    if (randomPages.length === 0) {
      return null;
    }

    if (randomPages.length === 1 || !exceptId) {
      return randomPages[Math.floor(Math.random() * randomPages.length)];
    }

    const filtered = randomPages.filter((page) => page.id !== exceptId);
    const source = filtered.length > 0 ? filtered : randomPages;
    return source[Math.floor(Math.random() * source.length)];
  }

  function getPageById(id) {
    return randomPages.find((page) => page.id === id) || null;
  }

  windowObj.ValentinePages = {
    randomPages,
    getRandomPage,
    getPageById
  };
})(window);
