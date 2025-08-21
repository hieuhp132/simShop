import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './SideBar.module.css';
import { useTranslation } from 'react-i18next';
import apiClient, { API_BASE_URL } from '../apiConfig.js';
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex.js';
import { BalanceContext } from './TopNav';

// Import SIM icon
import simIcon from '../assets/icons/sim-icon.png';

import facebookIcon from '../assets/icons/facebook.svg';
import instagramIcon from '../assets/icons/instagram.png';
import wechatIcon from '../assets/icons/4102581_applications_media_social_wechat_icon.svg';
import weiboIcon from '../assets/icons/4362953_weibo_logo_social media_icon.svg';
import snapchatIcon from '../assets/icons/4102574_applications_media_snapchat_social_icon.svg';
import ebayIcon from '../assets/icons/294688_ebay_icon.svg';
import nikeIcon from '../assets/icons/4202853_nike_icon.svg';
import amazonIcon from '../assets/icons/85118_amazon_icon.png';
import adidasIcon from '../assets/icons/Adidas_Logo_0.svg';
import alibabaIcon from '../assets/icons/Alibaba.com_idEWsQHb3s_0.svg';
import bumbleIcon from '../assets/icons/bumble.jpeg';
import faceitIcon from '../assets/icons/faceit.svg';
import fiverrIcon from '../assets/icons/fiverr-icon.svg';
import lazadaIcon from '../assets/icons/lazada.jpeg';
import shopeeIcon from '../assets/icons/shopee-icon.svg';
import burgerkingIcon from '../assets/icons/burgerking.png';
import immoscoutIcon from '../assets/icons/immoscout.png';
import immoweltIcon from '../assets/icons/immowelt.jpeg';
import suzukiIcon from '../assets/icons/icons8-suzuki-48.png';
import garenaIcon from '../assets/icons/icons8-garena.svg';
import riotgamesIcon from '../assets/icons/icons8-riot-games.svg';
import winIcon from '../assets/icons/1win.jpeg';
import cocacolaIcon from '../assets/icons/cocacola.jpeg';
import operaIcon from '../assets/icons/Opera_idY9Hn8Py2_1.svg';
import geminiIcon from '../assets/icons/gemini.jpeg';
import skrillIcon from '../assets/icons/skrill.jpeg';
import netflixIcon from '../assets/icons/netflix.jpeg';
import spotifyIcon from '../assets/icons/spotify.jpeg';
import ubisoftIcon from '../assets/icons/ubisoft.jpeg';
import uberIcon from '../assets/icons/uber.jpeg';
import kfcIcon from '../assets/icons/KFC_idjOyGqmuk_0.svg';
import xiaomiIcon from '../assets/icons/xiaomi.jpeg';
import mcdonaldsIcon from '../assets/icons/icons8-mcdonald.svg';
import wishIcon from '../assets/icons/Wish.jpeg';
import foodoraIcon from '../assets/icons/foodora.png';
import sheinIcon from '../assets/icons/SHEIN_idfILhpCAi_1.svg';
import cathayIcon from '../assets/icons/cathay.jpeg';
import indeedIcon from '../assets/icons/indeed.jpeg';
import tradingviewIcon from '../assets/icons/tradingview.png';
import wiseIcon from '../assets/icons/wise.png';
import zaloIcon from '../assets/icons/7044033_zalo_icon.svg';
import boltIcon from '../assets/icons/bolt.jpeg';
import aliexpressIcon from '../assets/icons/aliexpress.jpeg';
import alipayIcon from '../assets/icons/4373298_alipay_logo_logos_icon.svg';
import tinderIcon from '../assets/icons/1298767_tinder_icon.png';
import woltIcon from '../assets/icons/wolt.jpeg';
import kaggleIcon from '../assets/icons/kaggle.jpeg';
import viberIcon from '../assets/icons/viber.jpeg';
import paypalIcon from '../assets/icons/paypal.jpeg';
import twitchIcon from '../assets/icons/icons8-twitter-50.png';
import steamIcon from '../assets/icons/steam.jpeg';
import foodpandaIcon from '../assets/icons/foodpanda.png';
import yahooIcon from '../assets/icons/yahoo.jpeg';
import blizzardIcon from '../assets/icons/blizzard.jpeg';
import clubhouseIcon from '../assets/icons/clubhouse.jpeg';
import careemIcon from '../assets/icons/careem.jpeg';
import bigoIcon from '../assets/icons/bigolive.jpeg';
//import twitchIcon from '../assets/icons/twitch.jpeg';
import ncsoftIcon from '../assets/icons/NCSOFT_idem2apjXK_0.png';
import grabIcon from '../assets/icons/grab.jpeg';
import bitcloutIcon from '../assets/icons/bitclout.png';
import dominoIcon from '../assets/icons/dominospizza.jpeg';
import carousellIcon from '../assets/icons/carousell.png';
import gofundmeIcon from '../assets/icons/gofundme.jpeg';
import bet365Icon from '../assets/icons/bet365.png';
import taobaoIcon from '../assets/icons/Taobao_id-qQZaZ6R_0.png';
import verifykitIcon from '../assets/icons/Verifykit_idBWjJ4w3Q_0.png';
import openAIIcon from '../assets/icons/OpenAI_Icon_0.jpeg';
import _1688Icon from '../assets/icons/1688-2.png';
import _1kkiranaIcon from '../assets/icons/1kkirana.jpg';
import _23redIcon from '../assets/icons/23Red_Racing_Logo.png';


import _888casinoIcon from '../assets/icons/888casino.png';
import _99acressIcon from '../assets/icons/99acress.png';
import _99logoIcon from '../assets/icons/99_logo.png';
import agroinformIcon from '../assets/icons/agroinform.jpg';
import airtelIcon from '../assets/icons/airtel.png';
import aolIcon from '../assets/icons/aol.png';  
import astropayIcon from '../assets/icons/astropay.png';
import auchanIcon from '../assets/icons/auchan.png';
import avitoIcon from '../assets/icons/avito.png';
import baiduIcon from '../assets/icons/baidu.jpg';
import bilibiliIcon from '../assets/icons/bilibili.jpg';
import bisuIcon from '../assets/icons/bisu.jpg';
import bitloIcon from '../assets/icons/bitlo.png';
import bittubeIcon from '../assets/icons/bittube.jpg';
import blablacarIcon from '../assets/icons/blablacar.png';
import cardekhoIcon from '../assets/icons/cardekho.jpg';
import cdkeyIcon from '../assets/icons/cdkey.png';
import cekkazanIcon from '../assets/icons/cekkazan.png';
import celebeIcon from '../assets/icons/celebe.jpg';
import citymobilIcon from '../assets/icons/citymobil.jpg';
import clickentregasIcon from '../assets/icons/clickentregas.jpg';
import coinbaseIcon from '../assets/icons/coinbase.jpg';
import coindcxIcon from '../assets/icons/coindcx.png';
import craiglistIcon from '../assets/icons/craiglist.jpg';
import dbruaIcon from '../assets/icons/dbrua.jpg';
import deliverooIcon from '../assets/icons/deliveroo.jpg';
import deliveryIcon from '../assets/icons/delivery.png';
import dhaniIcon from '../assets/icons/dhani.png';
import didiIcon from '../assets/icons/didi.png';
import disneyhotstarIcon from '../assets/icons/disneyhotstar.jpg';
import dixyIcon from '../assets/icons/dixy.png';
import dodopizzaIcon from '../assets/icons/dodopizza.png';
import dostavistaIcon from '../assets/icons/dostavista.jpg';
import douyuIcon from '../assets/icons/douyu.png';
import dream11Icon from '../assets/icons/dream11.png';
import dromIcon from '../assets/icons/drom.jpg';
import dukascopyIcon from '../assets/icons/dukascopy.png';
import edgelessIcon from '../assets/icons/edgeless.png';
import eldoradoIcon from '../assets/icons/eldorado.png';
import electroneumIcon from '../assets/icons/electroneum.png';
import fetchrewardsIcon from '../assets/icons/fetchrewards.png';
import fiqsyIcon from '../assets/icons/fiqsy.jpg';
import flipkardIcon from '../assets/icons/flipkard.jpg';
import foodyIcon from '../assets/icons/foody.jpg';
import getirIcon from '../assets/icons/getir.jpg';
import gettIcon from '../assets/icons/gett.png';
import global24Icon from '../assets/icons/global24.png';
import globaltelIcon from '../assets/icons/globaltel.png';
import googlevoiceIcon from '../assets/icons/googlevoice.png';
import greenIcon from '../assets/icons/green.png';
import grindrIcon from '../assets/icons/grindr.png';
import handypickIcon from '../assets/icons/handypick.jpg';
import happnIcon from '../assets/icons/happn.png';
import harajIcon from '../assets/icons/haraj.jpg';
import hepsiburadaconIcon from '../assets/icons/hepsiburadacon.png';
import hezzlIcon from '../assets/icons/hezzl.png';
import hilyIcon from '../assets/icons/hily.png';
import hingeIcon from '../assets/icons/hinge.png';
import hopiIcon from '../assets/icons/hopi.png';
import hotlineIcon from '../assets/icons/hotline.png';
import housingIcon from '../assets/icons/housing.jpg';
import howzatIcon from '../assets/icons/howzat.png';
import hqtriviaIcon from '../assets/icons/hqtrivia.jpg';
import huyaIcon from '../assets/icons/huya.png';
import icardIcon from '../assets/icons/icard.jpg';
import icicidirectIcon from '../assets/icons/icicidirect.png';
import icqIcon from '../assets/icons/icq.png';
import icrypexIcon from '../assets/icons/icrypex.jpg';
import ifoodIcon from '../assets/icons/ifood.png';
import imoIcon from '../assets/icons/imo.png';
import indiaplaysIcon from '../assets/icons/indiaplays.png';
import infomaniakIcon from '../assets/icons/infomaniak.png';
import ininalIcon from '../assets/icons/ininal.png';
import lostIcon from '../assets/icons/lost.png';
import irancellIcon from '../assets/icons/irancell.png';
import irctcIcon from '../assets/icons/irctc.png';
import jdIcon from '../assets/icons/jd.jpg';
import jusdialIcon from '../assets/icons/jusdial.png';
import kakaotalkIcon from '../assets/icons/kakaotalk.png';
import kazandirioIcon from '../assets/icons/kazandirio.png';
import keybaseIcon from '../assets/icons/keybase.png';
import kotak881Icon from '../assets/icons/kotak881.jpg';
import kufarIcon from '../assets/icons/kufar.png';
import kvatplataIcon from '../assets/icons/kvatplata.png';
import kwaiIcon from '../assets/icons/kwai.png';
import laposteIcon from '../assets/icons/laposte.png';
import lbeyIcon from '../assets/icons/lbey.png';
import lightchatIcon from '../assets/icons/lightchat.jpg';
import likeeIcon from '../assets/icons/likee.png';
import lineIcon from '../assets/icons/line.png';
import livescoreIcon from '../assets/icons/livescore.png';
import locoffIcon from '../assets/icons/locoff.png';
import locoggIcon from '../assets/icons/locogg.png';
import lovelocalIcon from '../assets/icons/lovelocal.png';
import lykaIcon from '../assets/icons/lyka.jpg';
import magicbricksIcon from '../assets/icons/magicbricks.jpg';
import magicpinIcon from '../assets/icons/magicpin.jpg';
import magnitsIcon from '../assets/icons/magnits.png';
import mailruIcon from '../assets/icons/mailru.jpg';
import makemoneyIcon from '../assets/icons/makemoney.png';
import mantrimallIcon from '../assets/icons/mantrimall.jpg';
import medibudyIcon from '../assets/icons/medibudy.jpg';
import meeshoIcon from '../assets/icons/meesho.png';
import meetmeIcon from '../assets/icons/meetme.jpg';
import megaIcon from '../assets/icons/mega.png';
import megogoIcon from '../assets/icons/megogo.png';
import mercadoIcon from '../assets/icons/mercado.png';
import metroIcon from '../assets/icons/metro.png';
import michatIcon from '../assets/icons/michat.jpg';
import miratorgIcon from '../assets/icons/Untitled.png';
import mobikwikIcon from '../assets/icons/mobikwik.png';
import mobile01Icon from '../assets/icons/mobile01.jpg';
import mocospacesIcon from '../assets/icons/mocospaces.jpg';
import momoIcon from '../assets/icons/momo.png';
import moneseIcon from '../assets/icons/monese.jpg';
import moneylionIcon from '../assets/icons/moneylion.jpg';
import monoappIcon from '../assets/icons/monoapp.png';
import mosruIcon from '../assets/icons/mosru.png';
import mplIcon from '../assets/icons/mpl.png';
import mrgreenIcon from '../assets/icons/mrgreen.png';
import mtscashbackIcon from '../assets/icons/mtscashback.png';
import myfab11Icon from '../assets/icons/myfab11.jpg';
import myfishkaIcon from '../assets/icons/myfishka.png';
import mygloIcon from '../assets/icons/myglo.png';
import myloveIcon from '../assets/icons/mylove.jpg';
import mymusictasteIcon from '../assets/icons/mymusictaste.jpg';
import myntraIcon from '../assets/icons/myntra.png';
import naverIcon from '../assets/icons/naver.png';
import neteaseIcon from '../assets/icons/netease.png';
import nhsevenIcon from '../assets/icons/nhseven.png';
import niftyIcon from '../assets/icons/nifty.png';
import nimoIcon from '../assets/icons/nimo.jpg';
import nimsesIcon from '../assets/icons/nimses.png';
import nobrokerIcon from '../assets/icons/nobroker.jpg';
import noonIcon from '../assets/icons/noon.png';
import nttgameIcon from '../assets/icons/nttgame.png';
import odnoklassnikiIcon from '../assets/icons/odnoklassniki.png';
import offerupIcon from '../assets/icons/offerup.png';
import offgamerIcon from '../assets/icons/offgamer.jpg';
import okkoIcon from '../assets/icons/okko.jpg';
import oktaIcon from '../assets/icons/okta.png';
import olacabsIcon from '../assets/icons/olacabs.jpg';
import olxIcon from '../assets/icons/olx.png';
import onlinerIcon from '../assets/icons/onliner.png';
import ontaxiIcon from '../assets/icons/ontaxi.jpg';
import openpointIcon from '../assets/icons/openpoint.jpg';
import oraclecloudIcon from '../assets/icons/oraclecloud.png';
import oyoIcon from '../assets/icons/oyo.png';
import ozonIcon from '../assets/icons/ozon.png';
import paddypowerIcon from '../assets/icons/paddypower.png';
import panelstationIcon from '../assets/icons/panelstation.png';
import paparaIcon from '../assets/icons/papara.jpg';
import parimatchIcon from '../assets/icons/parimatch.png';
import paxfulIcon from '../assets/icons/paxful.jpg';
import paycellIcon from '../assets/icons/paycell.png';
import paysafecardIcon from '../assets/icons/paysafecard.png';
import paytmIcon from '../assets/icons/paytm.png';
import payzapIcon from '../assets/icons/payzap.png';
import peoplecomIcon from '../assets/icons/peoplecom.jpg';
import perekrestokIcon from '../assets/icons/perekrestok.jpg';
import pgbonusIcon from '../assets/icons/pgbonus.jpg';
import playerzpotIcon from '../assets/icons/playerzpot.png';
import pofIcon from '../assets/icons/pof.png';
import pokecIcon from '../assets/icons/pokec.jpg';
import pokermasterIcon from '../assets/icons/pokermaster.jpg';
import poshmarkIcon from '../assets/icons/poshmark.png';
import premiumoneIcon from '../assets/icons/premiumone.jpg';
import proboIcon from '../assets/icons/probo.png';
import protonmailIcon from '../assets/icons/protonmail.png';
import pureplattformIcon from '../assets/icons/pureplattform.png';
import pyaterochkaIcon from '../assets/icons/pyaterochka.jpg';
import q12triviaIcon from '../assets/icons/q12trivia.jpg';
import quikrIcon from '../assets/icons/quikr.png';
import quippIcon from '../assets/icons/quipp.png';
import rainmakerIcon from '../assets/icons/rainmaker.png';
import rakutenIcon from '../assets/icons/rakuten.png';
import redbookIcon from '../assets/icons/redbook.png';
import rediffmailIcon from '../assets/icons/rediffmail.jpg';
import reuseIcon from '../assets/icons/reuse.png';
import royalwinIcon from '../assets/icons/royalwin.jpg';
import rozetkaIcon from '../assets/icons/rozetka.png';
import rummyIcon from '../assets/icons/rummy.jpg';
import rummycultureIcon from '../assets/icons/rummyculture.jpg';
import rummyweathIcon from '../assets/icons/rummyweath.jpg';
import rutubeIcon from '../assets/icons/rutube.jpg';
import sahicoinIcon from '../assets/icons/sahicoin.jpg';
import samokatIcon from '../assets/icons/samokat.png';
import samsungshopIcon from '../assets/icons/samsungshop.jpg';
import seznamIcon from '../assets/icons/seznam.png';
import skoutIcon from '../assets/icons/skout.png';
import snappfoodIcon from '../assets/icons/snappfood.png';
import sneakersnstuffIcon from '../assets/icons/sneakersnstuff.png';
import spartenpokerIcon from '../assets/icons/spartenpoker.jpg';
import sportmasterIcon from '../assets/icons/sportmaster.png';
import steemitIcon from '../assets/icons/steemit.png';
import stolotoIcon from '../assets/icons/stoloto.jpg';
import surveyjunkieIcon from '../assets/icons/surveyjunkie.png';
import surveytimeIcon from '../assets/icons/surveytime.jpg';
import swagbucksIcon from '../assets/icons/swagbucks.png';
import swiggyIcon from '../assets/icons/swiggy.png';
import swvlIcon from '../assets/icons/swvl.jpg';
import talabatIcon from '../assets/icons/talabat.png';
import tangoIcon from '../assets/icons/tango.png';
import tantanIcon from '../assets/icons/tantan.jpg';
import taptapsendIcon from '../assets/icons/taptapsend.png';
import taskdealsinIcon from '../assets/icons/taskdealsin.png';
import tatacliqIcon from '../assets/icons/tatacliq.png';
import tencentqqIcon from '../assets/icons/tencentqq.png';
import teremokIcon from '../assets/icons/teremok.png';
import ticketmasterIcon from '../assets/icons/ticketmaster.png';
import toslaIcon from '../assets/icons/tosla.png';
import trendyolIcon from '../assets/icons/trendyol.jpg';
import tripIcon from '../assets/icons/trip.png';
import truecallerIcon from '../assets/icons/truecaller.png';
import twelfthmanIcon from '../assets/icons/twelfthman.jpg';
import unacademyIcon from '../assets/icons/unacademy.jpg';
import uploadedIcon from '../assets/icons/uploaded.png';
import vinotaIcon from '../assets/icons/vinota.png';
import vintedIcon from '../assets/icons/vinted.jpg';
import vipvendingIcon from '../assets/icons/vipvending.png';
import vkontakteIcon from '../assets/icons/vkontakte.png';
import weststeinIcon from '../assets/icons/weststein.png';
import whooshIcon from '../assets/icons/whoosh.png';
import wingmoneyIcon from '../assets/icons/wingmoney.png';
import winzoIcon from '../assets/icons/winzo.jpg';
import wizelyIcon from '../assets/icons/wizely.jpg';
import wmaraciIcon from '../assets/icons/wmaraci.png';
import yaayIcon from '../assets/icons/yaay.png';
import yallaIcon from '../assets/icons/yalla.png';
import yandexIcon from '../assets/icons/yandex.png';
import yappyIcon from '../assets/icons/yappy.png';
import yemeksepetiIcon from '../assets/icons/yemeksepeti.png';
import youdoIcon from '../assets/icons/youdo.jpg';
import yougotagiftIcon from '../assets/icons/yougotagift.png';
import youlaIcon from '../assets/icons/youla.jpg';
import youstarIcon from '../assets/icons/youstar.jpg';
import yuboIcon from '../assets/icons/yubo.png';
import zebpayIcon from '../assets/icons/zebpay.png';
import zeptoIcon from '../assets/icons/zepto.jpg';
import zigluIcon from '../assets/icons/ziglu.jpg';
import zohoIcon from '../assets/icons/zoho.png';
import zupeeIcon from '../assets/icons/zupee.png';
import bluedIcon from '../assets/icons/blued.jpg';
import boddeessIcon from '../assets/icons/boddess.jpg';
import coinfieldIcon from '../assets/icons/coinfield.jpg';

// Lấy danh sách tất cả quốc gia
const allCountries = Object.keys(countryDataMap).filter(
  (key) => key !== 'list'
);

// Lấy danh sách tất cả dịch vụ
function getAllServices() {
  const serviceSet = new Set();
  allCountries.forEach((country) => {
    const countryObj = countryDataMap[country]?.[country];
    if (countryObj) {
      Object.keys(countryObj).forEach((service) => serviceSet.add(service));
    }
  });
  return Array.from(serviceSet).sort();
}

function getServicesByCountry(country) {
  const countryObj = countryDataMap[country]?.[country];
  return countryObj ? Object.keys(countryObj) : [];
}

function getCountriesByService(service) {
  return allCountries.filter((country) => {
    const countryObj = countryDataMap[country]?.[country];
    return countryObj && countryObj[service];
  });
}

function getTotalCountForService(service, countryFilter) {
  let total = 0;
  const countries = countryFilter ? [countryFilter] : allCountries;
  countries.forEach((country) => {
    const countryObj = countryDataMap[country]?.[country];
    if (countryObj && countryObj[service]) {
      Object.values(countryObj[service]).forEach((net) => {
        if (net && typeof net.count === 'number') total += net.count;
      });
    }
  });
  return total;
}

function getTotalCountForCountry(country, serviceFilter) {
  let total = 0;
  const countryObj = countryDataMap[country]?.[country];
  if (!countryObj) return 0;
  const services = serviceFilter ? [serviceFilter] : Object.keys(countryObj);
  services.forEach((service) => {
    if (countryObj[service]) {
      Object.values(countryObj[service]).forEach((net) => {
        if (net && typeof net.count === 'number') total += net.count;
      });
    }
  });
  return total;
}

// Format số có dấu cách hàng nghìn
function formatNumber(num) {
  return num.toLocaleString('en-US').replace(/,/g, ' ');
}

// Icons cho dịch vụ với màu sắc (sử dụng CDN có màu)
const serviceIcons = {
  housing: housingIcon,
  pokec: pokecIcon,
  aol: aolIcon,
  
  1688: _1688Icon,
  '1kkirana': _1kkiranaIcon,
  '23red': _23redIcon,
  vkontakte: vkontakteIcon,
  delivery: deliveryIcon,
  deliveroo: deliverooIcon,
  '888casino': _888casinoIcon,
  '99acres': _99acressIcon,
  '99app': _99logoIcon,
  agroinform: agroinformIcon,
  airtel: airtelIcon,
  astropay: astropayIcon,
  auchan: auchanIcon,
  avito: avitoIcon,
  baidu: baiduIcon,
  bilibili: bilibiliIcon,
  bisu: bisuIcon,
  bitlo: bitloIcon,
  bittube: bittubeIcon,
  blued: bluedIcon,
  boddeess: boddeessIcon,
  blablacar: blablacarIcon,
  cardekho: cardekhoIcon,
  cdkey: cdkeyIcon,
  cekkazan: cekkazanIcon,
  celebe: celebeIcon,
  citymobil: citymobilIcon,
  clickentregas: clickentregasIcon,
  coindcx: coindcxIcon,
  coinfield: coinfieldIcon,
  coinbase: coinbaseIcon,

  craiglist: craiglistIcon,
  dbrua: dbruaIcon,
  dhani: dhaniIcon,
  didi: didiIcon,
  disneyhotstar: disneyhotstarIcon,
  dixy: dixyIcon,
  dodopizza: dodopizzaIcon,
  dostavista: dostavistaIcon,
  douyu: douyuIcon,
  dream11: dream11Icon,
  drom: dromIcon,
  dukascopy: dukascopyIcon,
  edgeless: edgelessIcon,
  eldorado: eldoradoIcon,
  electroneum: electroneumIcon,
  
  fetchrewards: fetchrewardsIcon,
  fiqsy: fiqsyIcon,
  foody: foodyIcon,
  getir: getirIcon,

 
  grab: grabIcon,
  flipkard: flipkardIcon,
  gett: gettIcon,
  global24: global24Icon,
  globaltel: globaltelIcon,
  googlevoice: googlevoiceIcon,
  green: greenIcon,
  grindr: grindrIcon,
  handypick: handypickIcon,
  happn: happnIcon,
  haraj: harajIcon,
  hepsiburadacon: hepsiburadaconIcon,

  hqtrivia: hqtriviaIcon,
  icard: icardIcon,
  icrypex: icrypexIcon,
  ifood: ifoodIcon,
  hezzl: hezzlIcon,
  hily: hilyIcon,
  hinge: hingeIcon,
  hopi: hopiIcon,
  hotline: hotlineIcon,
  howzat: howzatIcon,
  
  huya: huyaIcon,
  
  icicidirect: icicidirectIcon,
  icq: icqIcon,
  
  
  imo: imoIcon,
  indiaplayer: indiaplaysIcon,
  infomaniak: infomaniakIcon,
  ininal: ininalIcon,
  lost: lostIcon,
  irancell: irancellIcon,
  irctc: irctcIcon,
  jd: jdIcon,
  jusdial: jusdialIcon,
  kakaotalk: kakaotalkIcon,
  kazandirio: kazandirioIcon,
  keybase: keybaseIcon,
  'kotak881': kotak881Icon,
  kufar: kufarIcon,
  kvatplata: kvatplataIcon,
  kwai: kwaiIcon,
  laposte: laposteIcon,
  lbey: lbeyIcon,
  lightchat: lightchatIcon,
  likee: likeeIcon,
  line: lineIcon,
  livescore: livescoreIcon,
  locoff: locoffIcon,
  locogg: locoggIcon,
  lovelocal: lovelocalIcon,
  lyka: lykaIcon,
  magicbricks: magicbricksIcon,
  magicpin: magicpinIcon,
  magnits: magnitsIcon,
  mailru: mailruIcon,

  makemoney: makemoneyIcon,
  mantrimall: mantrimallIcon,

  medibudy: medibudyIcon,
  meesho: meeshoIcon,
  meetme: meetmeIcon,

  mega: megaIcon,
  megogo: megogoIcon,

  mercado: mercadoIcon,
  metro: metroIcon,
  michat: michatIcon,
  miratorg: miratorgIcon,
 
    mobikwik: mobikwikIcon,
    mobile01: mobile01Icon,
    mocospaces: mocospacesIcon,
    momo: momoIcon,
    monese: moneseIcon,
    moneylion: moneylionIcon,
    monoapp: monoappIcon,
    mosru: mosruIcon,
    mpl: mplIcon,
    mrgreen: mrgreenIcon,
    mtscashback: mtscashbackIcon,
    myfab11: myfab11Icon,
    myfishka: myfishkaIcon,
    mymusictaste: mymusictasteIcon,
    naver: naverIcon,
    netease: neteaseIcon,
    nhseven: nhsevenIcon,
    nifty: niftyIcon,
    nimo: nimoIcon,
    nimses: nimsesIcon,
    nobroker: nobrokerIcon,
    noon: noonIcon,
    nttgame: nttgameIcon,
    odnoklassniki: odnoklassnikiIcon,
    offerup: offerupIcon,
    offgamer: offgamerIcon,
    okko: okkoIcon,
    okta: oktaIcon,
    olacabs: olacabsIcon,
    olx: olxIcon,
    onliner: onlinerIcon,
    ontaxi: ontaxiIcon,
    openpoint: openpointIcon,
    oraclecloud: oraclecloudIcon,
    oyo: oyoIcon,
    ozon: ozonIcon,
    paddypower: paddypowerIcon,
    panelstation: panelstationIcon,
    papara: paparaIcon,
    parimatch: parimatchIcon,
    paxful: paxfulIcon,
    paycell: paycellIcon,
    paysafecard: paysafecardIcon,
    paytm: paytmIcon,
    payzap: payzapIcon,
    peoplecom: peoplecomIcon,
    perekrestok: perekrestokIcon,
    pgbonus: pgbonusIcon,
    playerzpot: playerzpotIcon,
    pof: pofIcon,
    pokermaster: pokermasterIcon,
    poshmark: poshmarkIcon,
    premiumone: premiumoneIcon,
    probo: proboIcon,
    protonmail: protonmailIcon,
    pureplattform: pureplattformIcon,
    pyaterochka: pyaterochkaIcon,
    q12trivia: q12triviaIcon,
    quikr: quikrIcon,
    quipp: quippIcon,
    rainmaker: rainmakerIcon,
    rakuten: rakutenIcon,
    redbook: redbookIcon,
    rediffmail: rediffmailIcon,
    reuse: reuseIcon,
    royalwin: royalwinIcon,
    rozetka: rozetkaIcon,
    rummy: rummyIcon,
    rummyculture: rummycultureIcon,
    rummyweath: rummyweathIcon,
    rutube: rutubeIcon,
    sahicoin: sahicoinIcon,
    samokat: samokatIcon,
    samsungshop: samsungshopIcon,
    seznam: seznamIcon,
    skout: skoutIcon,
    snappfood: snappfoodIcon,
    sneakersnstuff: sneakersnstuffIcon,
    spartenpoker: spartenpokerIcon,
    sportmaster: sportmasterIcon,
    steemit: steemitIcon,
    stoloto: stolotoIcon,
    surveyjunkie: surveyjunkieIcon,
    surveytime: surveytimeIcon,
    swagbucks: swagbucksIcon,
    swiggy: swiggyIcon,
    swvl: swvlIcon,
    talabat: talabatIcon,
    tango: tangoIcon,
    tantan: tantanIcon,
    taptapsend: taptapsendIcon,
    taskdealsin: taskdealsinIcon,
    tatacliq: tatacliqIcon,
    tencentqq: tencentqqIcon,
    teremok: teremokIcon,
    ticketmaster: ticketmasterIcon,
    tosla: toslaIcon,
    trendyol: trendyolIcon,
    trip: tripIcon,
    truecaller: truecallerIcon,
    twelfthman: twelfthmanIcon,
    unacademy: unacademyIcon,
    uploaded: uploadedIcon,
    vinota: vinotaIcon,
    vinted: vintedIcon,
    vipvending: vipvendingIcon,
    weststein: weststeinIcon,
    whoosh: whooshIcon,
    wingmoney: wingmoneyIcon,
    winzo: winzoIcon,
    wizely: wizelyIcon,
    wmaraci: wmaraciIcon,
    yaay: yaayIcon,
    yalla: yallaIcon,
    yandex: yandexIcon,
    yappy: yappyIcon,
    yemeksepeti: yemeksepetiIcon,
    youdo: youdoIcon,
    yougotagift: yougotagiftIcon,
    youla: youlaIcon,
    
    youstar: youstarIcon,
    yubo: yuboIcon,
    zebpay: zebpayIcon,
    zepto: zeptoIcon,
    ziglu: zigluIcon,
    zoho: zohoIcon,
    zupee: zupeeIcon,



    
 
    
    
    myglo: mygloIcon,
    mylove: myloveIcon,
    myntra: myntraIcon,
    
  
  
  
  
  
  
  
  
  
  
  openai: openAIIcon,
  skrill: skrillIcon,
  bumble: bumbleIcon,
  xiaomi: xiaomiIcon,
  win: winIcon,
  paypal: paypalIcon,
  twitch: twitchIcon,
  steam: steamIcon,
  foodpanda: foodpandaIcon,
  yahoo: yahooIcon,
  blizzard: blizzardIcon,
  clubhouse: clubhouseIcon,
  careem: careemIcon,
  bigolive: bigoIcon,
  ncsoft: ncsoftIcon,
  grabtaxi: grabIcon,
  bitclout: bitcloutIcon,
  dominospizza: dominoIcon,
  carousell: carousellIcon,
  gofundme: gofundmeIcon,
  bet365: bet365Icon,
  taobao: taobaoIcon,
  verifykit: verifykitIcon,
  
  
  // Social Media & Messaging
  facebook: facebookIcon,
  instagram: instagramIcon,
  twitter: twitchIcon,
  tiktok: 'https://cdn.svgporn.com/logos/tiktok-icon.svg',
  snapchat: snapchatIcon,
  linkedin: 'https://cdn.svgporn.com/logos/linkedin.svg',
  pinterest: 'https://cdn.svgporn.com/logos/pinterest.svg',
  reddit: 'https://cdn.svgporn.com/logos/reddit.svg',
  tumblr: 'https://cdn.svgporn.com/logos/tumblr.svg',
  wechat: wechatIcon,
  weibo: weiboIcon,
  
  telegram: 'https://cdn.svgporn.com/logos/telegram.svg',
  whatsapp: 'https://cdn.svgporn.com/logos/whatsapp.svg',
  viber: viberIcon,
  signal: 'https://cdn.svgporn.com/logos/signal.svg',
  kik: 'https://cdn.svgporn.com/logos/kik.svg',
  
  // Tech Companies
  google: 'https://cdn.svgporn.com/logos/google.svg',
  microsoft: 'https://cdn.svgporn.com/logos/microsoft-icon.svg',
  apple: 'https://cdn.svgporn.com/logos/apple.svg',
  amazon: amazonIcon,
  discord: 'https://cdn.svgporn.com/logos/discord-icon.svg',
  slack: 'https://cdn.svgporn.com/logos/slack.svg',
  zoom: 'https://cdn.svgporn.com/logos/zoom.svg',
  skype: 'https://cdn.svgporn.com/logos/skype.svg',
  meta: 'https://cdn.svgporn.com/logos/meta.svg',
  x: 'https://cdn.svgporn.com/logos/x.svg',
  threads: 'https://cdn.svgporn.com/logos/threads.svg',
  oracle: 'https://cdn.svgporn.com/logos/oracle.svg',
  ibm: 'https://cdn.svgporn.com/logos/ibm.svg',
  intel: 'https://cdn.svgporn.com/logos/intel.svg',
  nvidia: 'https://cdn.svgporn.com/logos/nvidia.svg',
  amd: 'https://cdn.svgporn.com/logos/amd.svg',
  cisco: 'https://cdn.svgporn.com/logos/cisco.svg',
  adobe: 'https://cdn.svgporn.com/logos/adobe.svg',
  salesforce: 'https://cdn.svgporn.com/logos/salesforce.svg',
  sap: 'https://cdn.svgporn.com/logos/sap.svg',
  vmware: 'https://cdn.svgporn.com/logos/vmware.svg',
  dell: 'https://cdn.svgporn.com/logos/dell.svg',
  hp: 'https://cdn.svgporn.com/logos/hp.svg',
  lenovo: 'https://cdn.svgporn.com/logos/lenovo.svg',
  asus: 'https://cdn.svgporn.com/logos/asus.svg',
  acer: 'https://cdn.svgporn.com/logos/acer.svg',
  samsung: 'https://cdn.svgporn.com/logos/samsung.svg',
  lg: 'https://cdn.svgporn.com/logos/lg.svg',
  sony: 'https://cdn.svgporn.com/logos/sony.svg',
  panasonic: 'https://cdn.svgporn.com/logos/panasonic.svg',
  philips: 'https://cdn.svgporn.com/logos/philips.svg',
  sharp: 'https://cdn.svgporn.com/logos/sharp.svg',
  toshiba: 'https://cdn.svgporn.com/logos/toshiba.svg',
  canon: 'https://cdn.svgporn.com/logos/canon.svg',
  nikon: 'https://cdn.svgporn.com/logos/nikon.svg',
  gopro: 'https://cdn.svgporn.com/logos/gopro.svg',
  fitbit: 'https://cdn.svgporn.com/logos/fitbit.svg',
  polar: 'https://cdn.svgporn.com/logos/polar.svg',
  tomtom: 'https://cdn.svgporn.com/logos/tomtom.svg',
  suzuki: suzukiIcon,
  opera: operaIcon,
  gemini: geminiIcon,
  winston: 'https://cdn.svgporn.com/logos/winston.svg',
  riotgames: riotgamesIcon,
  
  // E-commerce & Services
  faceit: faceitIcon,
  wolt: woltIcon,
  uber: uberIcon,
  lyft: 'https://cdn.svgporn.com/logos/lyft.svg',
  airbnb: 'https://cdn.svgporn.com/logos/airbnb.svg',
  booking: 'https://cdn.svgporn.com/logos/booking.svg',
  ebay: ebayIcon,
  aliexpress: aliexpressIcon,
  shopee: shopeeIcon,
  lazada: lazadaIcon,
  walmart: 'https://cdn.svgporn.com/logos/walmart.svg',
  target: 'https://cdn.svgporn.com/logos/target.svg',
  nike: nikeIcon,
  adidas: adidasIcon,
  upwork: 'https://cdn.svgporn.com/logos/upwork.svg',
  fiverr: fiverrIcon,
  etsy: 'https://cdn.svgporn.com/logos/etsy.svg',
  alibaba: alibabaIcon,
  
  tesla: 'https://cdn.svgporn.com/logos/tesla.svg',
  starbucks: 'https://cdn.svgporn.com/logos/starbucks.svg',
  mcdonalds: mcdonaldsIcon,
  kfc: kfcIcon,
  subway: 'https://cdn.svgporn.com/logos/subway.svg',
  dominos: 'https://cdn.svgporn.com/logos/dominos.svg',
  pizza_hut: 'https://cdn.svgporn.com/logos/pizza-hut.svg',
  burgerking: burgerkingIcon,
  bigc: 'https://cdn.svgporn.com/logos/big-c.svg',
  wish: wishIcon,
  shein: sheinIcon,
  cathay: cathayIcon,
  
  
  
  ola: 'https://cdn.svgporn.com/logos/ola.svg',
  bolt: boltIcon,
  free_now: 'https://cdn.svgporn.com/logos/free-now.svg',
  
  carpoolworld: 'https://cdn.svgporn.com/logos/carpoolworld.svg',
  waze: 'https://cdn.svgporn.com/logos/waze.svg',
  maps: 'https://cdn.svgporn.com/logos/maps.svg',
  google_maps: 'https://cdn.svgporn.com/logos/google-maps.svg',
  apple_maps: 'https://cdn.svgporn.com/logos/apple-maps.svg',
  bing_maps: 'https://cdn.svgporn.com/logos/bing-maps.svg',
  here: 'https://cdn.svgporn.com/logos/here.svg',
  mapbox: 'https://cdn.svgporn.com/logos/mapbox.svg',
  openstreetmap: 'https://cdn.svgporn.com/logos/openstreetmap.svg',
  osm: 'https://cdn.svgporn.com/logos/osm.svg',
  
  foodora: foodoraIcon,
  cocacola: cocacolaIcon,
  bet18: 'https://cdn.svgporn.com/logos/bet18.svg',
  garena: garenaIcon,
  immoscout24: immoscoutIcon,
  immowelt: immoweltIcon,
  ubisoft: ubisoftIcon,
  netflix: netflixIcon,
  spotify: spotifyIcon,
  indeed: indeedIcon,
  tradingview: tradingviewIcon,
  wise: wiseIcon,
  zalo: zaloIcon,
  alipay: alipayIcon,
  tinder: tinderIcon,
  kaggle: kaggleIcon
};
const countryIcons = {
  vietnam: 'https://flagcdn.com/24x18/vn.png',
  usa: 'https://flagcdn.com/24x18/us.png',
  russia: 'https://flagcdn.com/24x18/ru.png',
  england: 'https://flagcdn.com/24x18/gb.png',
  italy: 'https://flagcdn.com/24x18/it.png',
  spain: 'https://flagcdn.com/24x18/es.png',
  france: 'https://flagcdn.com/24x18/fr.png',
  germany: 'https://flagcdn.com/24x18/de.png',
  china: 'https://flagcdn.com/24x18/cn.png',
  japan: 'https://flagcdn.com/24x18/jp.png',
  korea: 'https://flagcdn.com/24x18/kr.png',
  india: 'https://flagcdn.com/24x18/in.png',
  brazil: 'https://flagcdn.com/24x18/br.png',
  canada: 'https://flagcdn.com/24x18/ca.png',
  australia: 'https://flagcdn.com/24x18/au.png',
  netherlands: 'https://flagcdn.com/24x18/nl.png',
  poland: 'https://flagcdn.com/24x18/pl.png',
  ukraine: 'https://flagcdn.com/24x18/ua.png',
  belarus: 'https://flagcdn.com/24x18/by.png',
  moldova: 'https://flagcdn.com/24x18/md.png',
  georgia: 'https://flagcdn.com/24x18/ge.png',
  latvia: 'https://flagcdn.com/24x18/lv.png',
  lithuania: 'https://flagcdn.com/24x18/lt.png',
  croatia: 'https://flagcdn.com/24x18/hr.png',
  slovenia: 'https://flagcdn.com/24x18/si.png',
  slovakia: 'https://flagcdn.com/24x18/sk.png',
  greece: 'https://flagcdn.com/24x18/gr.png',
  cyprus: 'https://flagcdn.com/24x18/cy.png',
  portugal: 'https://flagcdn.com/24x18/pt.png',
  ireland: 'https://flagcdn.com/24x18/ie.png',
  finland: 'https://flagcdn.com/24x18/fi.png',
  sweden: 'https://flagcdn.com/24x18/se.png',
  norway: 'https://flagcdn.com/24x18/no.png',
  denmark: 'https://flagcdn.com/24x18/dk.png',
  switzerland: 'https://flagcdn.com/24x18/ch.png',
  austria: 'https://flagcdn.com/24x18/at.png',
  belgium: 'https://flagcdn.com/24x18/be.png',
  malaysia: 'https://flagcdn.com/24x18/my.png',
  singapore: 'https://flagcdn.com/24x18/sg.png',
  thailand: 'https://flagcdn.com/24x18/th.png',
  philippines: 'https://flagcdn.com/24x18/ph.png',
  indonesia: 'https://flagcdn.com/24x18/id.png',
  cambodia: 'https://flagcdn.com/24x18/kh.png',
  laos: 'https://flagcdn.com/24x18/la.png',
  myanmar: 'https://flagcdn.com/24x18/mm.png',
  bangladesh: 'https://flagcdn.com/24x18/bd.png',
  pakistan: 'https://flagcdn.com/24x18/pk.png',
  sri_lanka: 'https://flagcdn.com/24x18/lk.png',
  nepal: 'https://flagcdn.com/24x18/np.png',
  afghanistan: 'https://flagcdn.com/24x18/af.png',
  iran: 'https://flagcdn.com/24x18/ir.png',
  iraq: 'https://flagcdn.com/24x18/iq.png',
  syria: 'https://flagcdn.com/24x18/sy.png',
  lebanon: 'https://flagcdn.com/24x18/lb.png',
  jordan: 'https://flagcdn.com/24x18/jo.png',
  israel: 'https://flagcdn.com/24x18/il.png',
  saudi_arabia: 'https://flagcdn.com/24x18/sa.png',
  yemen: 'https://flagcdn.com/24x18/ye.png',
  oman: 'https://flagcdn.com/24x18/om.png',
  uae: 'https://flagcdn.com/24x18/ae.png',
  qatar: 'https://flagcdn.com/24x18/qa.png',
  bahrain: 'https://flagcdn.com/24x18/bh.png',
  kuwait: 'https://flagcdn.com/24x18/kw.png',
  egypt: 'https://flagcdn.com/24x18/eg.png',
  libya: 'https://flagcdn.com/24x18/ly.png',
  tunisia: 'https://flagcdn.com/24x18/tn.png',
  algeria: 'https://flagcdn.com/24x18/dz.png',
  morocco: 'https://flagcdn.com/24x18/ma.png',
  senegal: 'https://flagcdn.com/24x18/sn.png',
  liberia: 'https://flagcdn.com/24x18/lr.png',
  ghana: 'https://flagcdn.com/24x18/gh.png',
  togo: 'https://flagcdn.com/24x18/tg.png',
  nigeria: 'https://flagcdn.com/24x18/ng.png',
  ethiopia: 'https://flagcdn.com/24x18/et.png',
  kenya: 'https://flagcdn.com/24x18/ke.png',
  uganda: 'https://flagcdn.com/24x18/ug.png',
  tanzania: 'https://flagcdn.com/24x18/tz.png',
  malawi: 'https://flagcdn.com/24x18/mw.png',
  angola: 'https://flagcdn.com/24x18/ao.png',
  argentina: 'https://flagcdn.com/24x18/ar.png',
  chile: 'https://flagcdn.com/24x18/cl.png',
  uruguay: 'https://flagcdn.com/24x18/uy.png',
  paraguay: 'https://flagcdn.com/24x18/py.png',
  bolivia: 'https://flagcdn.com/24x18/bo.png',
  peru: 'https://flagcdn.com/24x18/pe.png',
  ecuador: 'https://flagcdn.com/24x18/ec.png',
  colombia: 'https://flagcdn.com/24x18/co.png',
  venezuela: 'https://flagcdn.com/24x18/ve.png',
  mexico: 'https://flagcdn.com/24x18/mx.png',
  guatemala: 'https://flagcdn.com/24x18/gt.png',
  honduras: 'https://flagcdn.com/24x18/hn.png',
  haiti: 'https://flagcdn.com/24x18/ht.png',
  dominican_republic: 'https://flagcdn.com/24x18/do.png',
  cuba: 'https://flagcdn.com/24x18/cu.png',
  jamaica: 'https://flagcdn.com/24x18/jm.png',
  albania: 'https://flagcdn.com/24x18/al.png',
  hongkong: 'https://flagcdn.com/24x18/hk.png',
  mongolia: 'https://flagcdn.com/24x18/mn.png',
  northmacedonia: 'https://flagcdn.com/24x18/mk.png',
  salvador: 'https://flagcdn.com/24x18/sv.png',
  serbia: 'https://flagcdn.com/24x18/rs.png',
  tajikistan: 'https://flagcdn.com/24x18/tj.png',
  mauritius: 'https://flagcdn.com/24x18/mu.png',
  romania: 'https://flagcdn.com/24x18/ro.png',
  dominicana: 'https://flagcdn.com/24x18/do.png'
};
const defaultIcon = 'https://api.iconify.design/mdi:help-circle.svg'; // icon dấu hỏi cho dịch vụ mặc định

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function SideBar({ onSelectNetwork, setActivePage, setPriceTab, priceTab, user, onOrderCreated }) {
  const { t } = useTranslation();
  const { currency } = useContext(BalanceContext);
  const RUB_TO_VND = 330;

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [sidebarPriceTab, setSidebarPriceTab] = useState('price');

  // Sync với main content khi priceTab thay đổi
  useEffect(() => {
    if (priceTab) {
      setSidebarPriceTab(priceTab);
    }
  }, [priceTab]);


  const debouncedServiceSearch = useDebounce(serviceSearch, 250);
  const debouncedCountrySearch = useDebounce(countrySearch, 250);

  // Memo hóa danh sách dịch vụ
  const filteredServiceOptions = useMemo(() => {
    let options = getAllServices();
    if (selectedCountry) options = getServicesByCountry(selectedCountry);
    options = options.filter(s => s.toLowerCase().includes(debouncedServiceSearch.toLowerCase()));
    return options.sort((a, b) => getTotalCountForService(b, selectedCountry) - getTotalCountForService(a, selectedCountry));
  }, [selectedCountry, debouncedServiceSearch]);

  // Memo hóa danh sách quốc gia
  const filteredCountryOptions = useMemo(() => {
    let options = allCountries;
    if (selectedService) options = getCountriesByService(selectedService);
    options = options.filter(c => c.toLowerCase().includes(debouncedCountrySearch.toLowerCase()));
    return options.sort((a, b) => getTotalCountForCountry(b, selectedService) - getTotalCountForCountry(a, selectedService));
  }, [selectedService, debouncedCountrySearch]);

  // Networks
  const networks =
    selectedCountry && selectedService
      ? Object.entries(
          countryDataMap[selectedCountry]?.[selectedCountry]?.[selectedService] || {}
        )
      : [];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedNetwork(null);
    if (selectedService && !getServicesByCountry(country).includes(selectedService)) {
      setSelectedService('');
      onSelectNetwork(null);
    } else {
      onSelectNetwork(null);
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedNetwork(null);
    if (selectedCountry && !getCountriesByService(service).includes(selectedCountry)) {
      setSelectedCountry('');
      onSelectNetwork(null);
    } else {
      onSelectNetwork(null);
    }
  };

  const handleNetworkClick = (network, info) => {
    setSelectedNetwork({ network, ...info });
    onSelectNetwork && onSelectNetwork({ network, ...info });
  };

  const handlePurchaseNumber = async (network, info) => {
    if (!user) {
      alert(t('alert_login_required'));
      return;
    }

    if (!selectedService || !selectedCountry) {
      alert(t('alert_select_service_country'));
      return;
    }

    console.log('🔍 User:', user);
    try {
      console.log('🔍 Selected Service:', selectedService);
      console.log('🔍 Selected Country:', selectedCountry);
      console.log('🔍 Selected Network:', network);
      console.log('🔍 Selected Info:', info);

    
      const orderData = {
        userId: user._id,
        service: selectedService,
        country: selectedCountry,
        network: network,
        info: info,
      };

      console.log('🛒 Attempting to purchase number:', orderData);

      const response = await apiClient.post(`/api/orders`, orderData);

      if (response.data?.success) {
        alert(`Mua số thành công!`);
        // Navigate to purchase page to show the new order
        setActivePage && setActivePage('purchase');
        
        // Scroll to main content after navigation
        setTimeout(() => {
          const mainContent = document.querySelector('[data-main-content]');
          if (mainContent) {
            mainContent.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
        
        // Gọi callback để refresh đơn hàng trong PurchasePage
        if (onOrderCreated) {
          onOrderCreated(response.data.order || response.data);
        }

      } else {
        throw new Error('Server response indicates failure');
      }
    } catch (error) {
      console.error('Error purchasing number:', error);
      if (error.code === 'ECONNABORTED') {
        alert(t('alert_connection_timeout'));
      } else if (error.response?.status === 404) {
        alert(t('alert_api_endpoint_not_found'));
      } else if (error.response?.status >= 500) {
        alert(t('alert_server_error'));
      } else {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
          alert(serverMessage);
        } else {
          alert(t('alert_purchase_error'));
        }
      }
    }
  };

  // Số lượng hiển thị mặc định
  const MAX_SERVICE = 7;
  const MAX_COUNTRY = 7;

  // Lấy giá thấp nhất cho dịch vụ (from 1₽)
  function getMinCostForService(service, countryFilter) {
    let min = null;
    const countries = countryFilter ? [countryFilter] : allCountries;
    countries.forEach((country) => {
      const countryObj = countryDataMap[country]?.[country];
      if (countryObj && countryObj[service]) {
        Object.values(countryObj[service]).forEach((net) => {
          if (typeof net.cost === 'number') {
            if (min === null || net.cost < min) min = net.cost;
          }
        });
      }
    });
    return min;
  }

  return (
    <div className={styles.sidebar}>
      {/* Header lớn với logo 5sim */}
      <div className={styles.sidebarHeader}>
        <img src={simIcon} alt="SIM Icon" className={styles.sidebarLogo} />
        <div className={styles.sidebarTitle}><b>{t('sidebar_title')}</b> <br/> {t('sidebar_title_2')}</div>
      </div>
      {/* Tabs nhỏ */}
      <div className={styles.sidebarTabs}>
        <button
          className={sidebarPriceTab === 'price' ? styles.sidebarTabActive : styles.sidebarTab}
          onClick={() => {
            setActivePage && setActivePage('nav_price');
            setPriceTab && setPriceTab('price');
            setSidebarPriceTab('price');
          }}
        >{t('price_table_tab')}</button>
        <button
          className={sidebarPriceTab === 'stats' ? styles.sidebarTabActive : styles.sidebarTab}
          onClick={() => {
            setActivePage && setActivePage('nav_price');
            setPriceTab && setPriceTab('stats');
            setSidebarPriceTab('stats');
          }}
        >{t('stats_tab')}</button>
      </div>

      {/* Service */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_service')}</label>
        <input
          className={styles.searchBox}
          placeholder="Find website or app"
          value={serviceSearch}
          onChange={e => setServiceSearch(e.target.value)}
        />
        <button className={styles.addServiceBtn}>
          Add service
        </button>
        <div className={styles.list}>
          {(showAllServices ? filteredServiceOptions : filteredServiceOptions.slice(0, MAX_SERVICE)).map((service) => {
            const minCost = getMinCostForService(service, selectedCountry);
            const count = getTotalCountForService(service, selectedCountry);
            return (
              <button
                key={service}
                className={
                  styles.listItem +
                  (selectedService === service ? ' ' + styles.listItemActive : '')
                }
                onClick={() => handleServiceChange(service)}

              >
                <span className={styles.listItemMain}>
                  <img
                    src={serviceIcons[service] && typeof serviceIcons[service] === 'string' && serviceIcons[service].trim() !== '' ? serviceIcons[service] : defaultIcon}
                    alt="icon"
                    className={styles.listItemIcon}
                    onError={e => { e.target.onerror = null; e.target.src = defaultIcon; }}
                  />
                  <span className={styles.listItemName}>{service}</span>
                </span>
                <span className={styles.listItemRight}>
                  {minCost !== null && (
                    <span className={styles.listItemSub}>
                      from {currency === 'rub' ? minCost : Math.round(minCost * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}
                    </span>
                  )}
                  <span className={styles.listItemCount}>
                    {formatNumber(count)} <span style={{color:'#888',fontWeight:400,fontSize:'0.8em'}}>numbers</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {filteredServiceOptions.length > MAX_SERVICE && (
          <button className={styles.showAllBtn} onClick={() => setShowAllServices(s => !s)}>
            {showAllServices ? (t('collapse_list') || 'Collapse list') : (t('show_all') || 'Show all')}
          </button>
        )}
      </div>

      {/* Country */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_country')}</label>
        <input
          className={styles.searchBox}
          placeholder={t('sidebar_select_country_placeholder')}
          value={countrySearch}
          onChange={e => setCountrySearch(e.target.value)}
        />
        <div className={styles.list}>
          {(showAllCountries ? filteredCountryOptions : filteredCountryOptions.slice(0, MAX_COUNTRY)).map((c) => {
            return (
              <button
                key={c}
                className={
                  styles.listItem +
                  (selectedCountry === c ? ' ' + styles.listItemActive : '')
                }
                onClick={() => handleCountryChange(c)}
              >
                <span className={styles.listItemMain}>
                  <img
                    src={countryIcons[c] || countryIcons[c.replace(/\s+/g, '_')] || defaultIcon}
                    alt="icon"
                    className={styles.listItemIcon}
                    onError={e => { e.target.onerror = null; e.target.src = defaultIcon; }}
                  />
                  <span className={styles.listItemName}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                </span>
              </button>
            );
          })}
        </div>
        {filteredCountryOptions.length > MAX_COUNTRY && (
          <button className={styles.showAllBtn} onClick={() => setShowAllCountries(s => !s)}>
            {showAllCountries ? (t('collapse_list') || 'Collapse list') : (t('show_all') || 'Show all')}
          </button>
        )}
      </div>

      {/* Networks */}
      <div className={styles.selector}>
        <label className={styles.label}>{t('sidebar_select_network')}</label>
        {(!selectedCountry || !selectedService) ? (
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: '1rem',
            color: '#888',
            textAlign: 'center',
            fontSize: '1rem',
            marginTop: 8
          }}>
            {t('sidebar_select_network_hint') || 'Vui lòng chọn dịch vụ và quốc gia trước'}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:10}}>
            {selectedCountry && selectedService && networks
              .sort((a, b) => a[1].cost - b[1].cost)
              .map(([network, info]) => (
                <div
                  key={network}
                  style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    background:'#fff',
                    border:'1.5px solid #e5e7eb',
                    borderRadius:14,
                    boxShadow:'0 2px 8px #0001',
                    padding:'12px 18px',
                    cursor:'pointer',
                    transition:'box-shadow 0.18s, border 0.18s',
                    fontWeight:600,
                    fontSize:'1.08rem',
                    position:'relative',
                    ...(selectedNetwork?.network === network ? {border:'2px solid #2563eb',boxShadow:'0 4px 16px #2563eb22'} : {}),
                  }}
                  onClick={() => handleNetworkClick(network, info)}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px #2563eb22')}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = selectedNetwork?.network === network ? '0 4px 16px #2563eb22' : '0 2px 8px #0001')}
                >
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {/* Có thể thêm icon mạng nếu muốn */}
                    <span style={{fontWeight:700}}>{network}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12,minWidth:120,justifyContent:'flex-end'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center',marginRight:6}}>
                      <span style={{color:'#2563eb',fontWeight:700,fontSize:'1.13rem',lineHeight:1.1}}>
                        {currency === 'rub' ? info.cost : Math.round(info.cost * RUB_TO_VND)}{currency === 'rub' ? '₽' : '₫'}
                      </span>
                      <span style={{color:'#22c55e',fontWeight:500,fontSize:'0.98rem',lineHeight:1}}>
                        {formatNumber(info.count)} <span style={{color:'#888',fontWeight:400,fontSize:'0.97em'}}>numbers</span>
                      </span>
                    </div>
                    <button
                      className="cartBuyBtn"
                      style={{
                        width:36,height:36,borderRadius:'50%',background:'#f4f7ff',border:'1.5px solid #2563eb33',display:'flex',alignItems:'center',justifyContent:'center',padding:0,marginLeft:0,transition:'background 0.18s, border 0.18s',cursor:'pointer',boxShadow:'0 1px 4px #2563eb11',outline:'none',
                      }}
                      onClick={e => { e.stopPropagation(); handlePurchaseNumber(network, info); }}
                      title="Buy"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#cartGradient)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="cartGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                        <circle cx="10" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M2 4h2l2.2 13.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.8L20 7H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
