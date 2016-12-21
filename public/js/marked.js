/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

var emojiNameLibrary = ["smile",
"bowtie",
"simple_smile",
"laughing",
"blush",
"smiley",
"relaxed",
"smirk",
"heart_eyes",
"kissing_heart",
"kissing_closed_eyes",
"flushed",
"relieved",
"satisfied",
"grin",
"wink",
"stuck_out_tongue_winking_eye",
"stuck_out_tongue_closed_eyes",
"grinning",
"kissing",
"kissing_smiling_eyes",
"stuck_out_tongue",
"sleeping",
"worried",
"frowning",
"anguished",
"open_mouth",
"grimacing",
"confused",
"hushed",
"expressionless",
"unamused",
"sweat_smile",
"sweat",
"disappointed_relieved",
"weary",
"pensive",
"disappointed",
"confounded",
"fearful",
"cold_sweat",
"persevere",
"cry",
"sob",
"joy",
"astonished",
"scream",
"neckbeard",
"tired_face",
"angry",
"rage",
"triumph",
"sleepy",
"yum",
"mask",
"sunglasses",
"dizzy_face",
"imp",
"smiling_imp",
"neutral_face",
"no_mouth",
"innocent",
"alien",
"yellow_heart",
"blue_heart",
"purple_heart",
"heart",
"green_heart",
"broken_heart",
"heartbeat",
"heartpulse",
"two_hearts",
"revolving_hearts",
"cupid",
"sparkling_heart",
"sparkles",
"star",
"star2",
"dizzy",
"boom",
"collision",
"anger",
"exclamation",
"question",
"grey_exclamation",
"grey_question",
"zzz",
"dash",
"sweat_drops",
"notes",
"musical_note",
"fire",
"hankey",
"poop",
"shit",
"+1",
"thumbsup",
"-1",
"thumbsdown",
"ok_hand",
"punch",
"facepunch",
"fist",
"v",
"wave",
"hand",
"raised_hand",
"open_hands",
"point_up",
"point_down",
"point_left",
"point_right",
"raised_hands",
"pray",
"point_up_2",
"clap",
"muscle",
"metal",
"fu",
"runner",
"running",
"couple",
"family",
"two_men_holding_hands",
"two_women_holding_hands",
"dancer",
"dancers",
"ok_woman",
"no_good",
"information_desk_person",
"raising_hand",
"bride_with_veil",
"person_with_pouting_face",
"person_frowning",
"bow",
"couplekiss",
"couple_with_heart",
"massage",
"haircut",
"nail_care",
"boy",
"girl",
"woman",
"man",
"baby",
"older_woman",
"older_man",
"person_with_blond_hair",
"man_with_gua_pi_mao",
"man_with_turban",
"construction_worker",
"cop",
"angel",
"princess",
"smiley_cat",
"smile_cat",
"heart_eyes_cat",
"kissing_cat",
"smirk_cat",
"scream_cat",
"crying_cat_face",
"joy_cat",
"pouting_cat",
"japanese_ogre",
"japanese_goblin",
"see_no_evil",
"hear_no_evil",
"speak_no_evil",
"guardsman",
"skull",
"feet",
"lips",
"kiss",
"droplet",
"ear",
"eyes",
"nose",
"tongue",
"love_letter",
"bust_in_silhouette",
"busts_in_silhouette",
"speech_balloon",
"thought_balloon",
"feelsgood",
"finnadie",
"goberserk",
"godmode",
"hurtrealbad",
"rage1",
"rage2",
"rage3",
"rage4",
"suspect",
"trollface:",
"sunny",
"umbrella",
"cloud",
"snowflake",
"snowman",
"zap",
"cyclone",
"foggy",
"ocean",
"cat",
"dog",
"mouse",
"hamster",
"rabbit",
"wolf",
"frog",
"tiger",
"koala",
"bear",
"pig",
"pig_nose",
"cow",
"boar",
"monkey_face",
"monkey",
"horse",
"racehorse",
"camel",
"sheep",
"elephant",
"panda_face",
"snake",
"bird",
"baby_chick",
"hatched_chick",
"hatching_chick",
"chicken",
"penguin",
"turtle",
"bug",
"honeybee",
"ant",
"beetle",
"snail",
"octopus",
"tropical_fish",
"fish",
"whale",
"whale2",
"dolphin",
"cow2",
"ram",
"rat",
"water_buffalo",
"tiger2",
"rabbit2",
"dragon",
"goat",
"rooster",
"dog2",
"pig2",
"mouse2",
"ox",
"dragon_face",
"blowfish",
"crocodile",
"dromedary_camel",
"leopard",
"cat2",
"poodle",
"paw_prints",
"bouquet",
"cherry_blossom",
"tulip",
"four_leaf_clover",
"rose",
"sunflower",
"hibiscus",
"maple_leaf",
"leaves",
"fallen_leaf",
"herb",
"mushroom",
"cactus",
"palm_tree",
"evergreen_tree",
"deciduous_tree",
"chestnut",
"seedling",
"blossom",
"ear_of_rice",
"shell",
"globe_with_meridians",
"sun_with_face",
"full_moon_with_face",
"new_moon_with_face",
"new_moon",
"waxing_crescent_moon",
"first_quarter_moon",
"waxing_gibbous_moon",
"full_moon",
"waning_gibbous_moon",
"last_quarter_moon",
"waning_crescent_moon",
"last_quarter_moon_with_face",
"first_quarter_moon_with_face",
"crescent_moon",
"earth_africa",
"earth_americas",
"earth_asia",
"volcano",
"milky_way",
"partly_sunny",
"octocat",
"squirrel:",
"bamboo",
"gift_heart",
"dolls",
"school_satchel",
"mortar_board",
"flags",
"fireworks",
"sparkler",
"wind_chime",
"rice_scene",
"jack_o_lantern",
"ghost",
"santa",
"christmas_tree",
"gift",
"bell",
"no_bell",
"tanabata_tree",
"tada",
"confetti_ball",
"balloon",
"crystal_ball",
"cd",
"dvd",
"floppy_disk",
"camera",
"video_camera",
"movie_camera",
"computer",
"tv",
"iphone",
"phone",
"telephone",
"telephone_receiver",
"pager",
"fax",
"minidisc",
"vhs",
"sound",
"speaker",
"mute",
"loudspeaker",
"mega",
"hourglass",
"hourglass_flowing_sand",
"alarm_clock",
"watch",
"radio",
"satellite",
"loop",
"mag",
"mag_right",
"unlock",
"lock",
"lock_with_ink_pen",
"closed_lock_with_key",
"key",
"bulb",
"flashlight",
"high_brightness",
"low_brightness",
"electric_plug",
"battery",
"calling",
"email",
"mailbox",
"postbox",
"bath",
"bathtub",
"shower",
"toilet",
"wrench",
"nut_and_bolt",
"hammer",
"seat",
"moneybag",
"yen",
"dollar",
"pound",
"euro",
"credit_card",
"money_with_wings",
"e-mail",
"inbox_tray",
"outbox_tray",
"envelope",
"incoming_envelope",
"postal_horn",
"mailbox_closed",
"mailbox_with_mail",
"mailbox_with_no_mail",
"package",
"door",
"smoking",
"bomb",
"gun",
"hocho",
"pill",
"syringe",
"page_facing_up",
"page_with_curl",
"bookmark_tabs",
"bar_chart",
"chart_with_upwards_trend",
"chart_with_downwards_trend",
"scroll",
"clipboard",
"calendar",
"date",
"card_index",
"file_folder",
"open_file_folder",
"scissors",
"pushpin",
"paperclip",
"black_nib",
"pencil2",
"straight_ruler",
"triangular_ruler",
"closed_book",
"green_book",
"blue_book",
"orange_book",
"notebook",
"notebook_with_decorative_cover",
"ledger",
"books",
"bookmark",
"name_badge",
"microscope",
"telescope",
"newspaper",
"football",
"basketball",
"soccer",
"baseball",
"tennis",
"8ball",
"rugby_football",
"bowling",
"golf",
"mountain_bicyclist",
"bicyclist",
"horse_racing",
"snowboarder",
"swimmer",
"surfer",
"ski",
"spades",
"hearts",
"clubs",
"diamonds",
"gem",
"ring",
"trophy",
"musical_score",
"musical_keyboard",
"violin",
"space_invader",
"video_game",
"black_joker",
"flower_playing_cards",
"game_die",
"dart",
"mahjong",
"clapper",
"memo",
"pencil",
"book",
"art",
"microphone",
"headphones",
"trumpet",
"saxophone",
"guitar",
"shoe",
"sandal",
"high_heel",
"lipstick",
"boot",
"shirt",
"tshirt",
"necktie",
"womans_clothes",
"dress",
"running_shirt_with_sash",
"jeans",
"kimono",
"bikini",
"ribbon",
"tophat",
"crown",
"womans_hat",
"mans_shoe",
"closed_umbrella",
"briefcase",
"handbag",
"pouch",
"purse",
"eyeglasses",
"fishing_pole_and_fish",
"coffee",
"tea",
"sake",
"baby_bottle",
"beer",
"beers",
"cocktail",
"tropical_drink",
"wine_glass",
"fork_and_knife",
"pizza",
"hamburger",
"fries",
"poultry_leg",
"meat_on_bone",
"spaghetti",
"curry",
"fried_shrimp",
"bento",
"sushi",
"fish_cake",
"rice_ball",
"rice_cracker",
"rice",
"ramen",
"stew",
"oden",
"dango",
"egg",
"bread",
"doughnut",
"custard",
"icecream",
"ice_cream",
"shaved_ice",
"birthday",
"cake",
"cookie",
"chocolate_bar",
"candy",
"lollipop",
"honey_pot",
"apple",
"green_apple",
"tangerine",
"lemon",
"cherries",
"grapes",
"watermelon",
"strawberry",
"peach",
"melon",
"banana",
"pear",
"pineapple",
"sweet_potato",
"eggplant",
"tomato",
"corn:",
"house",
"house_with_garden",
"school",
"office",
"post_office",
"hospital",
"bank",
"convenience_store",
"love_hotel",
"hotel",
"wedding",
"church",
"department_store",
"european_post_office",
"city_sunrise",
"city_sunset",
"japanese_castle",
"european_castle",
"tent",
"factory",
"tokyo_tower",
"japan",
"mount_fuji",
"sunrise_over_mountains",
"sunrise",
"stars",
"statue_of_liberty",
"bridge_at_night",
"carousel_horse",
"rainbow",
"ferris_wheel",
"fountain",
"roller_coaster",
"ship",
"speedboat",
"boat",
"sailboat",
"rowboat",
"anchor",
"rocket",
"airplane",
"helicopter",
"steam_locomotive",
"tram",
"mountain_railway",
"bike",
"aerial_tramway",
"suspension_railway",
"mountain_cableway",
"tractor",
"blue_car",
"oncoming_automobile",
"car",
"red_car",
"taxi",
"oncoming_taxi",
"articulated_lorry",
"bus",
"oncoming_bus",
"rotating_light",
"police_car",
"oncoming_police_car",
"fire_engine",
"ambulance",
"minibus",
"truck",
"train",
"station",
"train2",
"bullettrain_front",
"bullettrain_side",
"light_rail",
"monorail",
"railway_car",
"trolleybus",
"ticket",
"fuelpump",
"vertical_traffic_light",
"traffic_light",
"warning",
"construction",
"beginner",
"atm",
"slot_machine",
"busstop",
"barber",
"hotsprings",
"checkered_flag",
"crossed_flags",
"izakaya_lantern",
"moyai",
"circus_tent",
"performing_arts",
"round_pushpin",
"triangular_flag_on_post",
"jp",
"kr",
"cn",
"us",
"fr",
"es",
"it",
"ru",
"gb:",
"one",
"two",
"three",
"four",
"five",
"six",
"seven",
"eight",
"nine",
"keycap_ten",
"1234",
"zero",
"hash",
"symbols",
"arrow_backward",
"arrow_down",
"arrow_forward",
"arrow_left",
"capital_abcd",
"abcd",
"abc",
"arrow_lower_left",
"arrow_lower_right",
"arrow_right",
"arrow_up",
"arrow_upper_left",
"arrow_upper_right",
"arrow_double_down",
"arrow_double_up",
"arrow_down_small",
"arrow_heading_down",
"arrow_heading_up",
"leftwards_arrow_with_hook",
"arrow_right_hook",
"left_right_arrow",
"arrow_up_down",
"arrow_up_small",
"arrows_clockwise",
"arrows_counterclockwise",
"rewind",
"fast_forward",
"information_source",
"ok",
"twisted_rightwards_arrows",
"repeat",
"repeat_one",
"new",
"top",
"up",
"cool",
"free",
"ng",
"cinema",
"koko",
"signal_strength",
"u5272",
"u5408",
"u55b6",
"u6307",
"u6708",
"u6709",
"u6e80",
"u7121",
"u7533",
"u7a7a",
"u7981",
"sa",
"restroom",
"mens",
"womens",
"baby_symbol",
"no_smoking",
"parking",
"wheelchair",
"metro",
"baggage_claim",
"accept",
"wc",
"potable_water",
"put_litter_in_its_place",
"secret",
"congratulations",
"m",
"passport_control",
"left_luggage",
"customs",
"ideograph_advantage",
"cl",
"sos",
"id",
"no_entry_sign",
"underage",
"no_mobile_phones",
"do_not_litter",
"non-potable_water",
"no_bicycles",
"no_pedestrians",
"children_crossing",
"no_entry",
"eight_spoked_asterisk",
"sparkle",
"eight_pointed_black_star",
"heart_decoration",
"vs",
"vibration_mode",
"mobile_phone_off",
"chart",
"currency_exchange",
"aries",
"taurus",
"gemini",
"cancer",
"leo",
"virgo",
"libra",
"scorpius",
"sagittarius",
"capricorn",
"aquarius",
"pisces",
"ophiuchus",
"six_pointed_star",
"negative_squared_cross_mark",
"a",
"b",
"ab",
"o2",
"diamond_shape_with_a_dot_inside",
"recycle",
"end",
"back",
"on",
"soon",
"clock1",
"clock130",
"clock10",
"clock1030",
"clock11",
"clock1130",
"clock12",
"clock1230",
"clock2",
"clock230",
"clock3",
"clock330",
"clock4",
"clock430",
"clock5",
"clock530",
"clock6",
"clock630",
"clock7",
"clock730",
"clock8",
"clock830",
"clock9",
"clock930",
"heavy_dollar_sign",
"copyright",
"registered",
"tm",
"x",
"heavy_exclamation_mark",
"bangbang",
"interrobang",
"o",
"heavy_multiplication_x",
"heavy_plus_sign",
"heavy_minus_sign",
"heavy_division_sign",
"white_flower",
"100",
"heavy_check_mark",
"ballot_box_with_check",
"radio_button",
"link",
"curly_loop",
"wavy_dash",
"part_alternation_mark",
"trident",
"black_small_square",
"white_small_square",
"black_medium_small_square",
"white_medium_small_square",
"black_medium_square",
"white_medium_square",
"black_large_square",
"white_large_square",
"white_check_mark",
"black_square_button",
"white_square_button",
"black_circle",
"white_circle",
"red_circle",
"large_blue_circle",
"large_blue_diamond",
"large_orange_diamond",
"small_blue_diamond",
"small_orange_diamond",
"small_red_triangle",
"small_red_triangle_down",
"shipit"];

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  emoji: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  emoji: /^:([A-Za-z0-9_\-\+]+?):/,
  text: replace(inline.text)
    (']|', ':~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }

  this.emojiTemplate = getEmojiTemplate(options);
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // emoji (gfm)
    if (cap = this.rules.emoji.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.emoji(cap[1]);
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Emoji Transformations
 */

function emojiDefaultTemplate(emoji) {
  return '<img src="'
    // + '/graphics/emojis/'
    + '/img/emoji/'
    + encodeURIComponent(emoji)
    + '.png"'
    + ' alt=":'
    + escape(emoji)
    + ':"'
    + ' title=":'
    + escape(emoji)
    + ':"'
    + ' class="emoji" align="absmiddle" height="20" width="20">';
}

function getEmojiTemplate(options) {
  if (options.emoji) {
    if (typeof options.emoji === 'function') {
      return options.emoji;
    }

    if (typeof options.emoji === 'string') {
      var emojiSplit = options.emoji.split(/\{emoji\}/g);
      return function(emoji) {
        return emojiSplit.join(emoji);
      }
    }
  }
  return emojiDefaultTemplate;
}

InlineLexer.prototype.emojiTemplate = emojiDefaultTemplate;
InlineLexer.prototype.emoji = function (name) {
  if (!this.options.emoji) return ':' + name + ':';

  if (emojiNameLibrary.indexOf(name) == -1) return ':' + name + ':';

  return this.emojiTemplate(name);
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  emoji: false,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
