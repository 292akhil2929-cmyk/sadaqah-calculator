// Original Tenglish (Telugu + English) one-liners written for G Theta.
// Not quotes from any film, show, or existing meme template.

export const addLines = [
  "Bag lo padindi bidda! 🛍️",
  "Adding chesko, tension enti mama?",
  "Cart ki oka kotha member vachadu 🎉",
  "Idi tీసుకున్నావా, semma choice!",
  "Order pettesav ante, respect undi నీకు 🔥",
  "ఒక్కటి ఏంటి, రెండు తీసుకో బాబు!",
  "Full swag mode ON ✅",
  "Nee style ki full మార్కులు 💯",
]

export const removeLines = [
  "Tీసేసావా? Sare, నీ ఇష్టం 😮‍💨",
  "Pోయింది pోనీలే, next di chudu",
  "Bag ఖాళీ ఐపోతోంది మరి...",
  "Cart nunchi exit తీసుకున్నాడు 🚪",
  "Sరే మామా, మనసు మారితే మల్లీ add cheyyi",
  "Deleted... pakka clean ah! 🧹",
  "Ee item కి బై చెప్పేసావ్",
]

export const emptyCartLines = [
  "Bag ఖాళీగా ఉంది... enti idi, festival mood ledha? 🛒",
  "Idi chala empty ga undi bro, konchem shopping cheddama?",
  "Cart lo em ledu... first order mొదలుపెట్టు!",
]

export const checkoutLines = [
  "Order confirm ayyindi ra bidda! 🚀",
  "Shipping start ayyaka full hero entry chేస్తుంది 😎",
  "Nee package పంపిస్తున్నాం, ready ga undu!",
]

export const wishlistLines = [
  "Wishlist lo pettesav, manam marchipోము 💛",
  "Idi save chేసుకున్నావ్, tarwata teesుకో మరి!",
]

export function randomOf(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}
