window.onload = function() {
	let menus = document.getElementsByClassName('nav navbar-nav');
	
	let collectableMenu = getElementByAttribute("ng-class","{ active: isActive('collectable', true) }",menus[0]);
	let collectableMenuOptions = collectableMenu.querySelectorAll('.dropdown-menu')[0];
		
	let toysMenuItem = ElementFromString('<li><a style="cursor:pointer;">Toys</a></li>')
	toysMenuItem.addEventListener("click", viewToys );
	collectableMenuOptions.appendChild(toysMenuItem); 

	let aboutMenu = menus[1].querySelectorAll('.dropdown-menu')[0];
	aboutMenu.appendChild(ElementFromString('<li role="separator" class="divider"></li>'));
	aboutMenu.appendChild(ElementFromString('<li style="display: block; padding: 3px 10px; clear: both; font-weight: bold; line-height: 1.42857143; color: #333; white-space: nowrap;">Toy box extension</li>')); 
	aboutMenu.appendChild(ElementFromString('<li><a target="_blank" href="http://Robert-Walker.com">Dev\'s site</a></li>')); 

	loadData();
};


function viewToys()
{
	let mainContainer = document.getElementsByClassName('container ng-scope')[0];

	mainContainer.innerHTML = '<div class="page-header"> <h2> Toys  <div class="progress progressRight"> <div class="progress max="100" type="success"> <div id="ToyProgressBar" class="progress-bar progress-bar-success"> <span id="ToyProgressBarNumber" class="ng-binding ng-scope">49 / 62 (79%)</span> </div>	</div> </div> </h2> </div>';

	let firstLetter = "";
	let letterBlock = [];	

	toys.forEach(function(toy) {
    	
    	let letter = toy[2].charAt(0);

    	if(firstLetter != letter)
    	{
    		if(firstLetter != "")
    		{
    			RenderToyBlock(mainContainer,firstLetter,letterBlock);
    			letterBlock = [];
    		}
    	}
   		letterBlock.push(toy);
    	firstLetter = letter;
	});

	RenderToyBlock(mainContainer,firstLetter,letterBlock);

	let checkBoxs = document.getElementsByClassName("toyCheckBox");
	for(let i = 0; i < checkBoxs.length ; i++)
	{
		checkBoxs[i].addEventListener("click", clickCheckBox);
	}

	SizeProgressBar();
}


function clickCheckBox(e)
{
	let checkbox = e["srcElement"];
	let div = checkbox.parentNode;
	let image = div.querySelectorAll('img')[0];

	let index = collectedToys.indexOf(checkbox.value);

	if(checkbox.checked)
	{
		if(index === -1 )
		{
			collectedToys.push(checkbox.value);
		}
		image.style.filter = "grayscale(0%)";
	}
	else
	{
		if (index != -1) 
		{
			collectedToys.splice(index, 1);
		}
		image.style.filter = "grayscale(100%)";
	}

	SizeProgressBar();
	saveData();
}

function SizeProgressBar()
{
	let bar = document.getElementById("ToyProgressBar");
	let percent = (collectedToys.length / toys.length) * 100;
	bar.style.width = percent + "%";


	let numberString = "";

	if(collectedToys.length >= 180)
	{
		numberString = collectedToys.length + " / " + toys.length + " (" + Math.floor(percent) + "%)";
	}
	else if(collectedToys.length >= 80)
	{
		numberString = collectedToys.length + " / " + toys.length;
	}
	else if(collectedToys.length >= 25)
	{
		numberString = collectedToys.length;
	}
	else
	{
		numberString = "";
	}

	let nunber = document.getElementById("ToyProgressBarNumber");
	nunber.innerHTML = numberString;

}

function RenderToyBlock(menus,letter,toyArray)
{
	let addString = '<div class="sect ng-scope"><h5 class="zoneHeader">'+letter+'</h5>';
	toyArray.forEach(function(blockToy) {
		let collected = collectedToys.indexOf(blockToy[0]) != -1;
		addString += '<div style="float:left;position:relative;"><input '+(collected ? "checked" : "") +' class="toyCheckBox" style="position:absolute;left:0;bottom:0;z-index:10;" type="checkbox" value="'+blockToy[0]+'"><a target="_blank" class="thumbnail ng-scope borderOff" href="//wowhead.com/item='+blockToy[0]+'"> <img style="filter: grayscale('+(collected ? "0" : "100")+'%);" src="//wow.zamimg.com/images/wow/icons/medium/'+blockToy[1]+'.jpg"> </a></div>';
	});
    addString += '</div>';
	menus.innerHTML += addString;
}

function ElementFromString(string)
{
	var div = document.createElement('div');
	div.innerHTML = string;
	return div.firstChild;
}


function getElementByAttribute(attr, value, root) {
    root = root || document.body;
    if(root.hasAttribute(attr) && root.getAttribute(attr) == value) {
        return root;
    }
    var children = root.children, 
        element;
    for(var i = children.length; i--; ) {
        element = getElementByAttribute(attr, value, children[i]);
        if(element) {
            return element;
        }
    }
    return null;
}

function saveData()
{
	chrome.storage.sync.set({'collectedToys': collectedToys}, function() {
		//console.log('Settings saved');
	});
}

function loadData() {
	chrome.storage.sync.get('collectedToys', function(data) {
		if(typeof data.collectedToys !== "undefined")
		{
			collectedToys = data.collectedToys;
		}
	});
}



var collectedToys = [];
let toys = [['116856','ability_fixated_state_red','\"Blooming Rose\" Contender\'s Costume'],
['116888','ability_fixated_state_blue','\"Night Demon\" Contender\'s Costume'],
['116889','ability_fixated_state_purple','\"Purple Phantom\" Contender\'s Costume'],
['116890','ability_fixated_state_orange','\"Santo\'s Sun\" Contender\'s Costume'],
['116891','ability_fixated_state_yellow','\"Snowy Owl\" Contender\'s Costume'],
['127670','ability_warlock_ancientgrimoire','Accursed Tome of the Sargerei'],
['86589','trade_archaeology_highbornesoulmirror','Ai-Li\'s Skymirror'],
['119217','inv_banner_03','Alliance Flag of Victory'],
['89614','archaeology_5_0_anatomicaldummy','Anatomical Dummy'],
['113570','ability_druid_manatree','Ancient\'s Bloom'],
['69776','trade_archaeology_insect-in-amber','Ancient Amber'],
['141296','inv_drink_27_bluesoup','Ancient Mana Basin'],
['85973','inv_mace_27','Ancient Pandaren Fishing Charm'],
['85500','inv_misc_fishing_raft','Anglers Fishing Raft'],
['117550','spell_nature_insect_swarm2','Angry Beehive'],
['86582','inv_qiraj_jewelglyphed','Aqua Jewel'],
['141297','ability_shaman_fortifyingwaters','Arcano-Shower'],
['118191','inv_staff_45','Archmage Vargoth\'s Spare Staff'],
['108735','inv_misc_horn_01','Arena Master\'s War Horn'],
['46843','achievement_reputation_argentchampion','Argent Crusader\'s Banner'],
['64456','trade_archaeology_naarucrystal','Arrival of the Naaru'],
['104329','inv_misc_monsterhorn_02','Ash-Covered Horn'],
['122126','misc_arrowright','Attraction Sign'],
['118427','item_hearthstone_card','Autographed Hearthstone Card'],
['119093','ability_priest_angelicfeather','Aviana\'s Feather'],
['90067','inv_valentinescardtornright','B. F. F. Necklace'],
['113540','creature_sporemushroom','Ba\'ruun\'s Bountiful Bloom'],
['129165','inv_misc_gem_crystal_02','Barnacle-Encrusted Gem'],
['120857','inv_cask_03','Barrel of Bandanas'],
['86565','inv_misc_horn_01','Battle Horn'],
['141879','inv_pet_bluemurlocegg','Berglrgl Perrgl Girggrlf'],
['142265','inv_misc_enggizmos_07','Big Red Raygun'],
['133997','inv_misc_cutgemnormal2','Black Ice'],
['119178','ability_druid_cyclone','Black Whirlwind'],
['104302','inv_knife_1h_grimbatolraid_d_03','Blackflame Daggers'],
['115503','inv_jewelry_necklace_103','Blazing Diamond Pendant'],
['116115','inv_shoulder_leather_firelandsdruid_d_01','Blazing Wings'],
['64481','trade_archaeology_oldgodtrinket','Blessing of the Old God'],
['87214','inv_pet_lilsmoky','Blingtron 4000'],
['111821','inv_misc_blingtron','Blingtron 5000'],
['132518','inv_engineering_blingtronscircuitdesigntutorial','Blingtron\'s Circuit Design Tutorial'],
['113096','ability_druid_disembowel','Bloodmane Charm'],
['54343','inv_gizmo_goblingtonkcontroller','Blue Crashin\' Thrashin\' Racer Controller'],
['122298','ability_siege_engineer_magnetic_lasso','Bodyguard Miniaturization Device'],
['97921','inv_potion_107','Bom\'bay\'s Color-Seein\' Sauce'],
['64646','trade_archaeology_bones-of-transformation','Bones of Transformation'],
['119432','achievement_dungeon_everbloom','Botani Camouflage'],
['134023','ability_druid_galewinds','Bottled Tornado'],
['128223','ability_vehicle_plaguebarrel','Bottomless Stygana Mushroom Brew'],
['34686','inv_misc_firedancer_01','Brazier of Dancing Flames'],
['116113','ability_druid_galewinds','Breath of Talador'],
['116758','inv_holiday_brewfestbuff_01','Brewfest Banner'],
['71137','ability_mount_ridinghorse','Brewfest Keg Pony'],
['33927','inv_cask_04','Brewfest Pony Keg'],
['140336','misc_drogbartotem02','Brulfist Idol'],
['114227','inv_wand_05','Bubble Wand'],
['134022','inv_helmet_66','Burgy Blackheart\'s Handsome Hat'],
['128310','inv_sword_2h_pvpcataclysms3_c_01','Burning Blade (toy)'],
['116440','inv_neck_firelands_03','Burning Defender\'s Medallion'],
['116122','creatureportrait_illidancrystal01','Burning Legion Missive (toy)'],
['49704','inv_misc_idol_01','Carved Ogre Idol'],
['103685','inv_misc_trinketpanda_07','Celestial Defender\'s Medallion'],
['102467','inv_offhand_1h_pvpcataclysms3_c_01','Censer of Eternal Agony'],
['89139','inv_belt_18','Chain Pet Leash'],
['86575','inv_offhand_pvealliance_d_01','Chalice of Secrets'],
['64373','trade_archaeology_chalice-of-mountainkings','Chalice of the Mountain Kings'],
['130254','inv_jewelcrafting_70_songcrystal','Chatterstone'],
['134020','achievement_profession_chefhat','Chef\'s Hat'],
['89222','ability_monk_surgingmist','Cloud Ring'],
['128807','inv_misc_coin_16','Coin of Many Faces'],
['138878','inv_misc_note_01','Copy of Daglop\'s Contract'],
['116435','spell_fire_fire','Cozy Bonfire'],
['140314','inv_knife_1h_saurok_01','Crab Shank'],
['108633','ability_ironmaidens_bombardment','Crashin\' Thrashin\' Cannon Controller'],
['108632','ability_ironmaidens_deployturret','Crashin\' Thrashin\' Flamer Controller'],
['104318','inv_misc_enggizmos_20','Crashin\' Thrashin\' Flyer Controller'],
['108635','achievement_boss_ironjuggernaut','Crashin\' Thrashin\' Killdozer Controller'],
['108634','ability_ironmaidens_incindiarydevice','Crashin\' Thrashin\' Mortar Controller'],
['37710','inv_gizmo_goblingtonkcontroller','Crashin\' Thrashin\' Racer Controller'],
['23767','inv_misc_idol_02','Crashin\' Thrashin\' Robot'],
['108631','ability_garrosh_siege_engine','Crashin\' Thrashin\' Roller Controller'],
['116763','ability_mount_shreddermount','Crashin\' Thrashin\' Shredder Controller'],
['142528','ability_hunter_pet_worm','Crate of Bobbers: Can of Worms'],
['142529','trade_archaeology_catstatueemeraldeyes','Crate of Bobbers: Cat Head'],
['142532','inv_misc_head_murloc_01','Crate of Bobbers: Murloc Head'],
['142531','inv_g_fishingbobber_05','Crate of Bobbers: Squeaky Duck'],
['142530','inv_garrison_cargoship','Crate of Bobbers: Tugboat'],
['143662','ability_garrison_orangebird','Crate of Bobbers: Wooden Pepe'],
['88589','inv_torch_lit','Cremating Torch'],
['131933','inv_weapon_rifle_41','Critter Hand Cannon'],
['131724','inv_archaeology_70_crystallineeyeofundravius','Crystalline Eye of Undravius'],
['122117','inv_misc_ancientarrakoafeather','Cursed Feather of Ikzan'],
['130171','archaeology_5_0_carvedbronzemirror','Cursed Orb'],
['134024','inv_helmet_49','Cursed Swabby Helmet'],
['38301','inv_misc_discoball_01','D.I.S.C.O.'],
['129057','ability_warrior_criticalblock','Dalaran Disc'],
['137294','inv_trinket_naxxramas02','Dalaran Initiates\' Pin'],
['93672','achievement_dungeon_outland_dungeonmaster','Dark Portal (TCG)'],
['122121','inv_darkmoon_eye','Darkmoon Gazer'],
['122123','inv_jewelry_ring_03','Darkmoon Ring-Flinger'],
['97994','inv_misc_seesaw','Darkmoon Seesaw'],
['122122','inv_gizmo_goblingtonkcontroller','Darkmoon Tonk Controller'],
['90899','ability_hunter_beastcall','Darkmoon Whistle'],
['131812','inv_datacrystal12','Darkshard Fragment'],
['54653','inv_misc_tournaments_symbol_troll','Darkspear Pride'],
['45021','inv_misc_tournaments_banner_nightelf','Darnassus Banner'],
['127859','inv_wand_21','Dazzling Rod'],
['129149','inv_crystallized_water','Death\'s Door Charm'],
['36863','inv_misc_dice_01','Decahedral Dwarven Dice'],
['108743','inv_boots_mail_pvpshaman_e_01','Deceptia\'s Smoldering Boots'],
['79769','achievement_boss_illidan','Demon Hunter\'s Aspect'],
['30542','inv_misc_enggizmos_07','Dimensional Ripper - Area 52'],
['142496','inv_misc_1h_pa_spoon_a_01','Dirty Spoon'],
['141298','inv_enchant_philostone_lv2','Displacer Meditation Stone'],
['139337','inv_helm_cloth_holiday_christmas_a_03','Disposable Winter Veil Suits'],
['134019','inv_helmet_50','Don Carlos\' Famous Hat'],
['64361','trade_archaeology_druidprieststatueset','Druid and Priest Statue Set'],
['21540','inv_misc_lantern_01','Elune\'s Lantern'],
['139773','inv_misc_herb_felblossom','Emerald Winds'],
['129279','inv_rod_enchantedadamantite','Enchanted Stone Whistle'],
['128636','inv_weapon_rifle_33','Endothermic Blaster'],
['86590','inv_misc_volatileair','Essence of the Breeze'],
['134007','inv_misc_cutgemnormal2','Eternal Black Diamond Ring'],
['104309','inv_summerfest_firedrink','Eternal Kiln'],
['86578','inv_jewelry_ring_39','Eternal Warrior\'s Sigil'],
['54452','ability_mage_netherwindpresence','Ethereal Portal'],
['118935','spell_nature_resistnature','Ever-Blooming Frond'],
['129929','trade_archaeology_highbornesoulmirror','Ever-Shifting Mirror'],
['89999','inv_misc_missilelarge_blue','Everlasting Alliance Firework'],
['122119','inv_misc_missilelarge_purple','Everlasting Darkmoon Firework'],
['90000','inv_misc_missilelarge_red','Everlasting Horde Firework'],
['45020','inv_misc_tournaments_banner_draenei','Exodar Banner'],
['53057','inv_helmet_29','Faded Wizard Hat'],
['129113','inv_misc_beer_01','Faintly Glowing Flagon of Mead'],
['142495','inv_misc_bone_06','Fake Teeth'],
['140780','inv_misc_cat_trinket09','Fal\'dorei Egg'],
['136846','inv_misc_enchantedpearl','Familiar Stone'],
['122304','inv_misc_bag_herbpouch','Fandral\'s Seed Pouch'],
['86581','inv_misc_coin_14','Farwater Conch'],
['127652','spell_fire_felfire','Felflame Campfire'],
['109167','inv_eng_mechanicalboomerang','Findle\'s Loot-A-Rang'],
['122129','inv_misc_flaskofvolatility','Fire-Eater\'s Vial'],
['119145','spell_frost_fireresistancetotem','Firefury Totem'],
['33223','inv_fishingchair','Fishing Chair'],
['129961','inv_leatherworking_70_flaminghoop','Flaming Hoop'],
['75042','inv_misc_balloon_01','Flimsy Yellow Balloon'],
['88801','ability_warrior_rampage','Flippable Table'],
['45063','ability_warrior_challange','Foam Sword Rack'],
['69227','inv_misc_gem_goldendraenite_01','Fool\'s Gold'],
['90888','inv_misc_soccerball','Foot Ball'],
['104324','inv_misc_soccerball','Foot Ball'],
['88802','inv_gizmo_goblingtonkcontroller','Foxicopter Controller'],
['44719','inv_drink_04','Frenzyheart Brew'],
['128471','inv_frostwolfpup','Frostwolf Grunt\'s Battlegear'],
['119083','inv_misc_basket_02','Fruit Basket'],
['116692','inv_misc_bag_10_green','Fuzzy Green Lounge Cushion'],
['118937','inv_misc_pelt_15','Gamon\'s Braid'],
['98136','inv_misc_shell_04','Gastropod Shell'],
['122120','inv_darkmoon_vengeance','Gaze of the Darkmoon'],
['127659','inv_helmet_66','Ghostly Iron Buccaneer\'s Hat'],
['117569','inv_misc_monsterspidercarapace_01','Giant Deathweb Egg'],
['90175','inv_weapon_shortblade_37','Gin-Ji Knife Set'],
['95589','achievement_reputation_kirintor_offensive','Glorious Standard of the Kirin Tor Offensive'],
['95590','achievement_faction_sunreaveronslaught','Glorious Standard of the Sunreaver Onslaught'],
['45019','inv_misc_tournaments_banner_gnome','Gnomeregan Banner'],
['54651','inv_misc_tournaments_symbol_gnome','Gnomeregan Pride'],
['40727','inv_misc_enggizmos_23','Gnomish Gravity Well'],
['40895','inv_gnomish_xray_specs','Gnomish X-Ray Specs'],
['33219','inv_drink_17','Goblin Gumbo Kettle'],
['35227','inv_misc_weathermachine_01','Goblin Weather Machine - Prototype 01-B'],
['88417','inv_misc_abyssalclam','Gokk\'lok\'s Shell'],
['119180','inv_misc_leather_shellfragment','Goren \'Log\' Roller'],
['118716','inv_misc_stonetablet_06','Goren Garb'],
['138900','inv_holiday_beerfestsausage03','Gravil Goldbraid\'s Famous Sausage Hat'],
['69895','inv_misc_food_45','Green Balloon'],
['67097','spell_fire_twilightfire','Grim Campfire'],
['129965','ability_hunter_pet_wolf','Grizzlesnout\'s Fang'],
['133511','inv_misc_enchantedpearlf','Gurboggle\'s Gleaming Bauble'],
['86584','inv_shield_18','Hardened Shell'],
['69777','inv_misc_archaeology_trolldrum','Haunted War Drum'],
['116139','inv_zulgurubtrinket','Haunting Memento'],
['119210','inv_misc_stonetablet_03','Hearthstone Board'],
['86594','ability_hunter_beastcall','Helpful Wikky\'s Whistle'],
['64358','trade_archaeology_highbornesoulmirror','Highborne Soul Mirror'],
['140325','inv_helm_mask_fittedalpha_b_01_nightborne_01','Home Made Party Mask'],
['87528','inv_holiday_brewfestbuff_01','Honorary Brewmaster Keg'],
['119218','inv_banner_03','Horde Flag of Victory'],
['129952','inv_gizmo_khoriumpowercore','Hourglass of Eternity (toy)'],
['86593','inv_misc_throwingball_01','Hozen Beach Ball'],
['88385','spell_totem_wardofdraining','Hozen Idol'],
['136855','ability_hunter_bestialdiscipline','Hunter\'s Call'],
['113631','inv_helmet_goggles_pandariatradeskill_d_01','Hypnosis Goggles'],
['32542','inv_potion_27','Imp in a Ball'],
['127707','inv_misc_coin_12','Indestructible Bone'],
['54212','inv_misc_statue_02','Instant Statue Pedestal'],
['43499','inv_drink_01','Iron Boot Flask'],
['118244','inv_helmet_66','Iron Buccaneer\'s Hat'],
['45018','inv_misc_tournaments_banner_dwarf','Ironforge Banner'],
['127668','inv_tradeskillitem_sorcerersfire','Jewel of Hellfire'],
['130251','inv_jewelcrafting_70_jeweltoy','JewelCraft'],
['88579','inv_cask_04','Jin Warmkeg\'s Brew'],
['141299','ability_malkorok_blightofyshaarj_yellow','Kal\'dorei Light Globe'],
['64383','trade_archaeology_kaldoreiwindchimes','Kaldorei Wind Chimes'],
['68806','item_icecrownnecklaced','Kalytha\'s Haunted Locket'],
['86571','inv_misc_stonetablet_04','Kang\'s Bindstone'],
['128462','inv_chest_cloth_draenei_c_01','Karabor Councilor\'s Attire'],
['88580','inv_mask_01','Ken-Ken\'s Mask'],
['95567','achievement_reputation_kirintor_offensive','Kirin Tor Beacon'],
['116125','ability_druid_manatree','Klikixx\'s Webspinner'],
['88566','inv_misc_bag_11','Krastinov\'s Bag of Horrors'],
['88531','inv_drink_04','Lao Chin\'s Last Mug'],
['140632','ability_shaman_echooftheelements','Lava Fountain'],
['129956','inv_leatherworking_70_loveseat','Leather Love Seat'],
['129960','inv_leatherworking_70_petbed','Leather Pet Bed'],
['129958','inv_leatherworking_70_petleash','Leather Pet Leash'],
['130199','spell_warlock_demonicportal_green','Legion Pocket Portal'],
['140786','inv_fishing_innards_eggs','Ley Spider Eggs'],
['71259','inv_misc_necklace_firelands_2','Leyara\'s Locket'],
['128536','spell_fire_twilightfire','Leylight Brazier'],
['119039','trade_archaeology_orc_bloodtext','Lilian\'s Warning Sign'],
['70722','spell_burningsoul','Little Wickerman'],
['63269','inv_misc_dice_02','Loaded Gnomish Dice'],
['60854','inv_eng_mechanicalboomerang2','Loot-A-Rang'],
['142341','inv_misc_love_gondola','Love Boat'],
['40768','inv_misc_molle','MOLL-E'],
['141300','ability_shootwand','Magi Focusing Crystal'],
['127696','spell_mage_temporalshield','Magic Pet Mirror'],
['72159','inv_misc_idol_01','Magical Ogre Idol'],
['131900','ability_warstomp','Majestic Elderhorn Hoof'],
['118938','inv_misc_cat_trinket05','Manastorm\'s Duplicator'],
['129926','achievement_reputation_ashtonguedeathsworn','Mark of the Ashtongue'],
['142536','ability_mage_massinvisibility','Memory Cube'],
['46709','inv_gizmo_goblingtonkcontroller','MiniZep Controller'],
['89205','inv_misc_orb_03','Mini Mana Bomb'],
['140324','inv_rod_titanium','Mobile Telemancy Beacon'],
['101571','ability_mount_whitedirewolf','Moonfang Shroud'],
['105898','inv_gauntlets_02','Moonfang\'s Paw'],
['130232','inv_misc_petmoonkinta','Moonfeather Statue'],
['119092','inv_potion_86','Moroes\' Famous Polish'],
['141862','inv_offhand_ulduarraid_d_03','Mote of Light'],
['130102','inv_knife_1h_common_b_01green','Mother\'s Skinning Knife'],
['113670','achievement_boss_murmur','Mournful Moan of Murmur'],
['86568','inv_misc_cat_trinket10','Mr. Smite\'s Brass Compass'],
['143660','inv_misc_horn_01','Mrgrglhjorn'],
['52201','spell_frost_frostward','Muradin\'s Favor'],
['33079','inv_misc_head_murloc_01','Murloc Costume'],
['70161','inv_mushroom_05','Mushroom Chair'],
['70159','inv_misc_flute_01','Mylune\'s Call'],
['119001','inv_cask_02','Mystery Keg'],
['138873','inv_helm_cloth_witchhat_b_01','Mystical Frosh Hat'],
['140231','inv_7_0raid_trinket_010a','Narcissa\'s Mirror'],
['86596','inv_fishingchair','Nat\'s Fishing Chair'],
['136849','ability_druid_manatree','Nature\'s Beacon'],
['130209','garrison_bronzechest','Never Ending Toy Chest'],
['112324','inv_misc_steel_hitching_post2','Nightmarish Hitching Post'],
['134004','inv_jewelry_ring_72','Noble\'s Eternal Elementium Signet'],
['104262','inv_misc_enchantedpearld','Odd Polished Stone'],
['118224','inv_cask_02','Ogre Brewing Kit'],
['46780','inv_misc_ogrepinata','Ogre Pinata'],
['1973','inv_misc_orb_02','Orb of Deception'],
['35275','inv_misc_orb_02','Orb of the Sin\'dorei'],
['45014','inv_misc_tournaments_banner_orc','Orgrimmar Banner'],
['120276','inv_misc_trinket6oih_wolf1','Outrider\'s Bridle Chain'],
['90427','archaeology_5_0_emptykegofbrewfatherxinwoyin','Pandaren Brewpack'],
['86588','inv_musket_04','Pandaren Firework Launcher'],
['89869','trade_archaeology_troll_voodoodoll','Pandaren Scarecrow'],
['86586','inv_misc_flute_01','Panflute of Pandaria'],
['34499','inv_misc_toy_06','Paper Flying Machine Kit'],
['130158','inv_holiday_summerfest_petals','Path of Elothir'],
['64881','trade_archaeology_pendant-of-the-aqir','Pendant of the Scarab Storm'],
['115468','spell_frost_frost','Permanent Frost Essence'],
['115472','creatureportrait_bubble','Permanent Time Bubble'],
['49703','inv_misc_missilesmall_purple','Perpetual Purple Firework'],
['108745','achievement_faction_celestials','Personal Hologram'],
['127864','inv_misc_tolbaradsearchlight','Personal Spotlight'],
['118221','creatureportrait_altarofearth_01','Petrification Stone'],
['123851','inv_misc_bomb_01','Photo B.O.M.B.'],
['13379','inv_misc_flute_01','Piccolo of the Flaming Fire'],
['32566','inv_box_01','Picnic Basket'],
['116689','inv_misc_bag_10_red','Pineapple Lounge Cushion'],
['140363','ability_bossfellord_felfissure','Pocket Fel Spreader'],
['127394','inv_podling_red','Podling Camouflage'],
['122700','inv_gizmo_goblinboombox_01','Portable Audiophone'],
['30690','inv_battery_02','Power Converter'],
['108739','inv_misc_gem_pearl_08','Pretty Draenor Pearl'],
['140309','inv_enchant_prismaticsphere','Prismatic Bauble'],
['88370','inv_jewelcrafting_goldenhare','Puntable Marmot'],
['142494','inv_misc_flower_04','Purple Blossom'],
['64482','trade_archaeology_cthunspuzzlebox','Puzzle Box of Yogg-Saron'],
['136934','inv_pet_scorchedstone','Raging Elemental Stone'],
['133998','inv_misc_gem_variety_02','Rainbow Generator'],
['129093','trade_archaeology_antleredcloakclasp','Ravenbear Disguise'],
['44820','inv_misc_bandage_16','Red Ribbon Pet Leash'],
['128776','inv_misc_xmassled','Red Wooden Sled'],
['104294','spell_warlock_soulburn','Rime of the Time-Lost Mariner'],
['116067','inv_60dungeon_ring5b','Ring of Broken Promises'],
['119215','ability_siege_engineer_magnetic_crush','Robo-Gnomebulator'],
['131811','ability_mount_pandarenkitemount','Rocfeather Skyhorn Kite'],
['34480','inv_valentinescard01','Romantic Picnic Basket'],
['37460','inv_misc_bandage_15','Rope Pet Leash'],
['122283','inv_jewelry_necklace_109','Rukhmar\'s Sacred Memory'],
['138876','inv_stone_grindingstone_04','Runas\' Crystal Grinder'],
['82467','inv_chest_leather_04','Ruthers\' Harness'],
['122674','inv_misc_-selfiecamera_01','S.E.L.F.I.E. Camera MkII'],
['128794','inv_misc_bag_enchantedrunecloth','Sack of Spectral Spiders'],
['71628','inv_misc_bag_10','Sack of Starfish'],
['92738','inv_helm_cloth_petsafari_a_01','Safari Hat'],
['116690','inv_misc_bag_10','Safari Lounge Cushion'],
['86583','inv_banner_03','Salyin Battle Banner'],
['119134','spell_fel_incinerate','Sargerei Disguise'],
['127655','spell_shadow_summonimp','Sassy Imp'],
['136927','ability_priest_bindingprayers','Scarlet Confessional Book'],
['116456','trade_archaeology_highborne_scroll','Scroll of Storytelling'],
['126931','archaeology_5_0_spearofxuen','Seafarer\'s Slidewhistle'],
['45015','inv_misc_tournaments_banner_troll','Sen\'jin Banner'],
['97942','inv_misc_archaeology_trolldrum','Sen\'jin Spirit Drum'],
['141649','inv_misc_matchbook','Set of Matches'],
['119421','trade_archaeology_draenei_artifactfragment','Sha\'tari Defender\'s Medallion'],
['98132','inv_weapon_rifle_33','Shado-Pan Geyser Gun'],
['86573','inv_stone_15','Shard of Archstone'],
['129055','inv_box_04','Shoe Shine Kit'],
['88387','inv_drink_17','Shushen\'s Spittoon'],
['116400','inv_weapon_rifle_01','Silver-Plated Turkey Shooter'],
['45017','inv_misc_tournaments_banner_bloodelf','Silvermoon City Banner'],
['88381','inv_elemental_mote_air01','Silversage Incense'],
['128328','inv_misc_bag_09_black','Skoller\'s Bag of Squirrel Treats'],
['143544','inv_helm_laughingskull_01','Skull of Corruption'],
['127669','inv_misc_bone_orcskull_01','Skull of the Mad Chief'],
['138415','inv_misc_book_10','Slightly-Chewed Insult Book'],
['17716','spell_frost_windwalkon','Snowmaster 9000'],
['137663','inv_sword_139','Soft Foam Sword'],
['119182','inv_datacrystal01','Soul Evacuation Crystal'],
['119163','warlock_spelldrain','Soul Inhaler'],
['138202','inv_misc_missilelarge_green','Sparklepony XL'],
['127695','inv_wand_16','Spirit Wand'],
['118222','ability_druid_forceofnature','Spirit of Bashiok'],
['113543','inv_misc_foot_centaur','Spirit of Shinri'],
['72161','trade_archaeology_uldumcanopicjar','Spurious Sarcophagus'],
['91904','trade_archaeology_antleredcloakclasp','Stackable Stag'],
['109739','spell_arcane_starfire','Star Chart'],
['66888','inv_wand_01','Stave of Fur and Claw'],
['116757','achievement_cooking_masterofthegrill','Steamworks Sausage Grill'],
['129211','inv_misc_book_10','Steamy Romance Novel Kit'],
['122681','inv_misc_book_09','Sternfathom\'s Pet Journal'],
['111476','spell_frost_wisp','Stolen Breath'],
['140160','inv_misc_horn_05','Stormforged Vrykul Horn'],
['45011','inv_misc_tournaments_banner_human','Stormwind Banner'],
['95568','achievement_faction_sunreaveronslaught','Sunreaver Beacon'],
['37254','inv_misc_orb_03','Super Simian Sphere'],
['139587','inv_crate_01','Suspicious Crate'],
['52253','inv_misc_enggizmos_18','Sylvanas\' Music Box'],
['130157','inv_rod_titanium','Syxsehnz Rod'],
['136935','inv_wand_22','Tadpole Cloudseeder'],
['116120','inv_misc_food_115_condorsoup','Tasty Talador Lunch'],
['130170','inv_misc_gem_pearl_13','Tear of the Green Aspect'],
['136928','spell_holy_dizzy','Thaumaturgist\'s Orb'],
['130151','inv_misc_food_lunchbox_devilsaur','The \'Devilsaur\' Lunchbox'],
['38578','inv_banner_03','The Flag of Ownership'],
['80822','inv_misc_food_24','The Golden Banana'],
['50471','spell_brokenheart','The Heartbreaker'],
['64488','trade_archaeology_theinnkeepersdaughter','The Innkeeper\'s Daughter'],
['127766','inv_misc_herb_felblossom','The Perfect Blossom'],
['104323','inv_misc_football','The Pigskin'],
['90883','inv_misc_football','The Pigskin'],
['43824','inv_misc_book_11','The Schools of Arcane Magic - Mastery'],
['130147','inv_misc_herb_goldthorn_bramble','Thistleleaf Branch'],
['127709','ability_deathwing_bloodcorruption_earth','Throbbing Blood Orb'],
['45013','inv_misc_tournaments_banner_tauren','Thunder Bluff Banner'],
['119160','spell_nature_invisibilitytotem','Tickle Totem'],
['32782','inv_qirajidol_war','Time-Lost Figurine'],
['54438','inv_misc_toy_02','Tiny Blue Ragdoll'],
['54437','inv_misc_toy_03','Tiny Green Ragdoll'],
['142497','inv_misc_bag_07','Tiny Pack'],
['44430','inv_misc_coin_18','Titanium Seal of Dalaran'],
['63141','inv_misc_tolbaradsearchlight','Tol Barad Searchlight'],
['64997','inv_misc_tolbaradsearchlight','Tol Barad Searchlight#Horde'],
['133542','inv_helmet_170','Tosselwrench\'s Mega-Accurate Simulation Viewfinder'],
['88584','spell_shaman_totemrecall','Totem of Harmony'],
['119144','trade_archaeology_dignified-draenei-portrait','Touch of the Naaru'],
['130169','inv_misc_emberweavecloth','Tournament Favor'],
['44606','inv_misc_toy_10','Toy Train Set'],
['122293','icon_orangebird_toy','Trans-Dimensional Bird Whistle'],
['130191','garrison_silverchest','Trapped Treasure Chest Kit'],
['115506','ability_rogue_disguise','Treessassin\'s Guise'],
['116651','inv_staff_52','True Love Prism'],
['88377','inv_misc_food_41','Turnip Paint \'Gun\''],
['88375','inv_misc_food_56','Turnip Punching Bag'],
['30544','inv_misc_blizzcon09_graphicscard','Ultrasafe Transporter: Toshley\'s Station'],
['45016','inv_misc_tournaments_banner_scourge','Undercity Banner'],
['141301','inv_misc_enggizmos_18','Unstable Powder Box'],
['45984','inv_misc_idol_05','Unusual Compass'],
['141331','inv_potion_22','Vial of Green Goo'],
['127666','inv_potion_52','Vial of Red Goo'],
['113375','inv_misc_legarmorkit','Vindicator\'s Armor Polish Kit'],
['119003','spell_nature_groundingtotem','Void Totem'],
['136937','inv_waepon_bow_zulgrub_d_01','Vol\'jin\'s Serpent Totem'],
['69775','inv_misc_archaeology_vrykuldrinkinghorn','Vrykul Drinking Horn'],
['143534','inv_misc_discoball_01','inv_misc_discoball_01 of Simulated Life'],
['69215','ability_mount_ridinghorse','War Party Hitching Post'],
['119219','inv_banner_03','Warlord\'s Flag of Victory'],
['104331','trade_archaeology_vrykul_runestick','Warning Sign'],
['138490','ability_shaman_watershield','Waterspeaker\'s Totem'],
['117573','inv_summerfest_firespirit','Wayfarer\'s Bonfire'],
['130249','inv_misc_druidstone01','Waywatcher\'s Boon'],
['113542','inv_elemental_mote_air01','Whispers of Rai\'Vosh'],
['131814','inv_misc_fish_42','Whitewater Carp'],
['97919','inv_hand_1h_trollshaman_c_01','Whole-Body Shrinka\''],
['129938','inv_jewelry_trinket_04','Will of Northrend'],
['45057','inv_misc_head_clockworkgnome_01','Wind-Up Train Wrecker'],
['119212','item_hearthstone_card','Winning Hand'],
['17712','spell_frost_frostward','Winter Veil Disguise Kit'],
['64651','trade_archaeology_wispamulet','Wisp Amulet'],
['141306','trade_alchemy_potione2','Wisp in a Bottle'],
['18660','inv_misc_enggizmos_08','World Enlarger'],
['109183','inv_misc_enggizmos_09','World Shrinker'],
['112059','ability_siege_engineer_pattern_recognition','Wormhole Centrifuge'],
['48933','spell_fire_bluefirenova','Wormhole Generator: Northrend'],
['87215','sha_spell_fire_felfirenova','Wormhole Generator: Pandaria'],
['130214','inv_misc_toy_01','Worn Doll'],
['36862','inv_misc_dice_02','Worn Troll Dice'],
['134021','inv_helmet_49','X-52 Rocket Helmet'],
['98552','inv_misc_flute_01','Xan\'tish\'s Flute'],
['69896','inv_misc_throwingball_01','Yellow Balloon'],
['116691','inv_misc_bag_10_black','Zhevra Lounge Cushion']];