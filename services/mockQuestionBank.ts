import { Question, Subject } from '../types';

// Helper to create randomized questions safely
const createQuestionWithRandomOptions = (id: string, text: string, correctAnswer: string, wrongAnswers: string[], explanation: string): Question => {
    // Ensure unique options
    const uniqueWrong = Array.from(new Set(wrongAnswers)).filter(w => w !== correctAnswer);
    // Fill if not enough (fallback)
    while(uniqueWrong.length < 3) {
        uniqueWrong.push(`${Math.floor(Math.random() * 1000)}`);
    }
    const finalWrong = uniqueWrong.slice(0, 3);
    
    const allOptions = [correctAnswer, ...finalWrong];
    // Shuffle options
    const options = allOptions.sort(() => 0.5 - Math.random());
    const correctAnswerIndex = options.indexOf(correctAnswer);
    
    return {
        id,
        text,
        options,
        correctAnswerIndex,
        explanation
    };
};

// --- MATHS GENERATOR ---
const generateMathQuestionsSafe = (count: number): Question[] => {
    const questions: Question[] = [];
    for(let i=0; i<count; i++) {
        const type = Math.floor(Math.random() * 20); // INCREASED TO 20 Distinct Types
        const id = `MAT-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (type === 0) { // Basic Arithmetic
            const a = Math.floor(Math.random() * 200) + 10;
            const b = Math.floor(Math.random() * 200) + 10;
            const isAdd = Math.random() > 0.5;
            const correct = isAdd ? a + b : a - b;
            questions.push(createQuestionWithRandomOptions(
                id, 
                `Solve: ${a} ${isAdd ? '+' : '-'} ${b}`,
                correct.toString(),
                [(correct+10).toString(), (correct-5).toString(), (correct+2).toString()],
                `${a} ${isAdd ? '+' : '-'} ${b} = ${correct}`
            ));
        } else if (type === 1) { // Area of Square
             const side = Math.floor(Math.random() * 15) + 3;
             const correct = side * side;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Find the area of a square with side ${side} cm.`,
                 `${correct} sq cm`,
                 [`${correct+10} sq cm`, `${side*2} sq cm`, `${side*4} sq cm`],
                 `Area = side × side = ${side} × ${side} = ${correct}`
             ));
        } else if (type === 2) { // Perimeter of Rectangle
             const l = Math.floor(Math.random() * 15) + 5;
             const b = Math.floor(Math.random() * 10) + 2;
             const correct = 2 * (l + b);
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Find perimeter of rectangle with L=${l}cm, B=${b}cm.`,
                 `${correct} cm`,
                 [`${l*b} cm`, `${correct+5} cm`, `${l+b} cm`],
                 `Perimeter = 2 × (L + B) = 2 × (${l} + ${b}) = ${correct}`
             ));
        } else if (type === 3) { // Multiplication
             const a = Math.floor(Math.random() * 20) + 11;
             const b = Math.floor(Math.random() * 9) + 2;
             const correct = a * b;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Multiply: ${a} × ${b}`,
                 `${correct}`,
                 [`${correct+b}`, `${correct-a}`, `${correct+10}`],
                 `${a} × ${b} = ${correct}`
             ));
        } else if (type === 4) { // Division/Quotient
            const divisor = Math.floor(Math.random() * 8) + 2;
            const quotient = Math.floor(Math.random() * 12) + 1;
            const dividend = divisor * quotient;
            questions.push(createQuestionWithRandomOptions(
                id,
                `Divide ${dividend} by ${divisor}.`,
                `${quotient}`,
                [`${quotient+1}`, `${quotient-1}`, `${quotient+2}`],
                `${dividend} ÷ ${divisor} = ${quotient}`
            ));
        } else if (type === 5) { // Simple Interest
             const P = (Math.floor(Math.random() * 10) + 1) * 1000;
             const R = Math.floor(Math.random() * 5) + 2;
             const T = Math.floor(Math.random() * 3) + 1;
             const SI = (P * R * T) / 100;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Calculate Simple Interest: P=₹${P}, R=${R}%, T=${T} yrs.`,
                 `₹${SI}`,
                 [`₹${SI+100}`, `₹${SI-50}`, `₹${P+SI}`],
                 `SI = (P×R×T)/100 = (${P}×${R}×${T})/100 = ${SI}`
             ));
        } else if (type === 6) { // Speed Distance
             const S = (Math.floor(Math.random() * 10) + 2) * 10; // 20,30..
             const T = Math.floor(Math.random() * 4) + 2;
             const D = S * T;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Speed = ${S} km/hr, Time = ${T} hrs. Find Distance.`,
                 `${D} km`,
                 [`${D+10} km`, `${S+T} km`, `${D/2} km`],
                 `Distance = Speed × Time = ${S} × ${T} = ${D}`
             ));
        } else if (type === 7) { // Profit
             const CP = (Math.floor(Math.random() * 20) + 2) * 50;
             const Profit = 50;
             const SP = CP + Profit;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Cost Price = ₹${CP}, Profit = ₹${Profit}. Find Selling Price.`,
                 `₹${SP}`,
                 [`₹${CP-Profit}`, `₹${SP+50}`, `₹${CP}`],
                 `SP = CP + Profit = ${CP} + ${Profit} = ${SP}`
             ));
        } else if (type === 8) { // Roman Numerals
             const map: Record<number, string> = { 1: 'I', 5: 'V', 10: 'X', 50: 'L', 100: 'C', 500: 'D', 1000: 'M' };
             const keys = [1, 5, 10, 50, 100, 500, 1000];
             const num = keys[Math.floor(Math.random() * keys.length)];
             const symbol = map[num];
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Roman Numeral for ${num} is?`,
                 `${symbol}`,
                 ['X', 'L', 'C', 'M'].filter(x => x !== symbol).slice(0,3),
                 `Standard Roman Numeral.`
             ));
        } else if (type === 9) { // Fractions Addition
             const den = Math.floor(Math.random() * 8) + 2;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Solve: 2/${den} + 3/${den}`,
                 `5/${den}`,
                 [`6/${den}`, `1/${den}`, `5/${den*2}`],
                 `Same denominator: (2+3)/${den} = 5/${den}`
             ));
        } else if (type === 10) { // Geometry Angles
             const angles = [30, 45, 60, 90, 120, 180];
             const ang = angles[Math.floor(Math.random() * angles.length)];
             let name = "Acute";
             if (ang === 90) name = "Right";
             if (ang > 90 && ang < 180) name = "Obtuse";
             if (ang === 180) name = "Straight";
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `An angle of ${ang}° is called?`,
                 name,
                 ["Acute", "Right", "Obtuse", "Straight"].filter(n => n !== name).slice(0,3),
                 `${ang}° matches the definition of ${name} angle.`
             ));
        } else if (type === 11) { // Place Value
             const num = Math.floor(Math.random() * 9000) + 1000; // 4 digit
             const str = num.toString();
             const pos = Math.floor(Math.random() * 4); // 0 to 3
             const placeNames = ["Thousands", "Hundreds", "Tens", "Ones"];
             const val = parseInt(str[pos]) * Math.pow(10, 3-pos);
             
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Place value of ${str[pos]} in ${num}?`,
                 `${val}`,
                 [`${parseInt(str[pos])}`, `${val*10}`, `${val/10 || 1}`],
                 `${str[pos]} is at ${placeNames[pos]} place.`
             ));
        } else if (type === 12) { // Percentage
             const p = (Math.floor(Math.random() * 10) + 1) * 5; // 5, 10, ... 50%
             const total = (Math.floor(Math.random() * 20) + 1) * 10; // 10, 20... 200
             const ans = (p / 100) * total;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Calculate ${p}% of ${total}.`,
                 `${ans}`,
                 [`${ans+10}`, `${ans/2}`, `${total/2}`],
                 `${p}% = ${p}/100. (${p}/100) × ${total} = ${ans}`
             ));
        } else if (type === 13) { // Average
             const n1 = Math.floor(Math.random() * 20) + 10;
             const n2 = n1 + Math.floor(Math.random() * 10) + 2;
             const avg = Math.floor(Math.random() * 20) + 10;
             // We want (n1 + n2 + x) / 3 = avg => x = 3*avg - n1 - n2
             const x = (3 * avg) - n1 - n2;
             // Ensure x is positive
             const finalX = x > 0 ? x : x + 20; 
             const finalAvg = Math.round((n1 + n2 + finalX) / 3);
             
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Find the average of ${n1}, ${n2}, and ${finalX}.`,
                 `${finalAvg}`,
                 [`${finalAvg+2}`, `${finalAvg-1}`, `${finalAvg+5}`],
                 `Sum = ${n1}+${n2}+${finalX} = ${n1+n2+finalX}. Average = Sum/3 = ${finalAvg}.`
             ));
        } else if (type === 14) { // Unit Conversion
             const kg = Math.floor(Math.random() * 9) + 1;
             const g = Math.floor(Math.random() * 9) * 100; // 0, 100, ... 900
             const totalG = kg * 1000 + g;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Convert ${kg} kg ${g} g into grams.`,
                 `${totalG} g`,
                 [`${kg}${g} g`, `${totalG+100} g`, `${kg*100+g} g`],
                 `1 kg = 1000 g. ${kg}000 + ${g} = ${totalG} g.`
             ));
        } else if (type === 15) { // Rounding
             const base = Math.floor(Math.random() * 800) + 100;
             const digit = Math.floor(Math.random() * 9) + 1;
             const num = base * 10 + digit; // e.g. 1234
             // Round to nearest 10
             const rem = num % 10;
             const rounded = rem >= 5 ? num + (10 - rem) : num - rem;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Round ${num} to the nearest 10.`,
                 `${rounded}`,
                 [`${rounded+10}`, `${rounded-10}`, `${num}`],
                 `${num} is closer to ${rounded}.`
             ));
        } else if (type === 16) { // Temperature
             const c = [0, 10, 20, 30, 40, 50, 100][Math.floor(Math.random() * 7)];
             const f = (c * 9/5) + 32;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Convert ${c}°C to Fahrenheit.`,
                 `${f}°F`,
                 [`${f+10}°F`, `${c+32}°F`, `${f-5}°F`],
                 `Formula: (°C × 9/5) + 32. (${c} × 1.8) + 32 = ${f}.`
             ));
        } else if (type === 17) { // Factors
             const numList = [12, 15, 18, 20, 24, 30, 36, 40, 50];
             const num = numList[Math.floor(Math.random() * numList.length)];
             const factors: number[] = [];
             for(let k=1; k<=num; k++) if(num%k===0) factors.push(k);
             
             const correct = factors[Math.floor(Math.random() * factors.length)];
             const wrong1 = num + Math.floor(Math.random()*5) + 1;
             const wrong2 = num + Math.floor(Math.random()*10) + 6;
             const wrong3 = num === 12 ? 7 : 11; // Hardcoded fallback for simplicity
             
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Which of these is a factor of ${num}?`,
                 `${correct}`,
                 [`${wrong1}`, `${wrong2}`, `${wrong3}`].map(String),
                 `Factors of ${num} include ${factors.slice(0, 4).join(', ')}...`
             ));
        } else if (type === 18) { // Complementary Angles
             const ang = Math.floor(Math.random() * 80) + 5;
             const comp = 90 - ang;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Find the complementary angle of ${ang}°.`,
                 `${comp}°`,
                 [`${180-ang}°`, `${ang}°`, `${comp+10}°`],
                 `Complementary angles add up to 90°. 90 - ${ang} = ${comp}.`
             ));
        } else { // 19: Simple BODMAS
             const x = Math.floor(Math.random() * 10) + 2;
             const y = Math.floor(Math.random() * 5) + 2;
             const z = Math.floor(Math.random() * 5) + 1;
             // x + y * z
             const ans = x + (y * z);
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Simplify: ${x} + ${y} × ${z}`,
                 `${ans}`,
                 [`${(x+y)*z}`, `${ans+2}`, `${ans-2}`],
                 `BODMAS Rule: Multiply first. ${y} × ${z} = ${y*z}. Then ${x} + ${y*z} = ${ans}.`
             ));
        }
    }
    return questions;
};

// --- REASONING GENERATOR ---
const generateReasoningQuestionsSafe = (count: number): Question[] => {
    const questions: Question[] = [];
    for(let i=0; i<count; i++) {
        const id = `REA-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
        const type = Math.floor(Math.random() * 12); // INCREASED TO 12 Distinct Types
        
        if (type === 0) { // Series
            const start = Math.floor(Math.random() * 20);
            const jump = Math.floor(Math.random() * 5) + 1;
            const s = [start, start+jump, start+jump*2, start+jump*3];
            const correct = start + jump*4;
            questions.push(createQuestionWithRandomOptions(
                id,
                `Complete series: ${s.join(', ')}, ?`,
                `${correct}`,
                [`${correct+1}`, `${correct-2}`, `${correct+jump}`],
                `Pattern is +${jump}.`
            ));
        } else if (type === 1) { // Cube/Squares
            const base = Math.floor(Math.random() * 9) + 2;
            const isSq = Math.random() > 0.5;
            const ans = isSq ? base*base : base*base*base;
            questions.push(createQuestionWithRandomOptions(
                id,
                `Find the ${isSq ? 'square' : 'cube'} of ${base}.`,
                `${ans}`,
                [`${ans+10}`, `${base*2}`, `${ans-1}`],
                `${base}${isSq ? '²' : '³'} = ${ans}`
            ));
        } else if (type === 2) { // Directions
            const dirs = ["North", "South", "East", "West"];
            const startDir = dirs[Math.floor(Math.random() * 4)];
            const map: any = { "North": "East", "East": "South", "South": "West", "West": "North" };
            const correct = map[startDir];
            questions.push(createQuestionWithRandomOptions(
                id,
                `Facing ${startDir}, turn 90° clockwise. New direction?`,
                correct,
                dirs.filter(d => d !== correct).slice(0, 3),
                `Clockwise from ${startDir} is ${correct}.`
            ));
        } else if (type === 3) { // Coding
            const letter = String.fromCharCode(65 + Math.floor(Math.random() * 23)); // A-W
            const shift = 2;
            const code = String.fromCharCode(letter.charCodeAt(0) + shift);
            const qL = String.fromCharCode(65 + Math.floor(Math.random() * 23));
            const qA = String.fromCharCode(qL.charCodeAt(0) + shift);
            questions.push(createQuestionWithRandomOptions(
                id,
                `If ${letter} = ${code}, then ${qL} = ?`,
                qA,
                [String.fromCharCode(qA.charCodeAt(0)+1), String.fromCharCode(qA.charCodeAt(0)-1), 'Z'],
                `Pattern is +2 letters.`
            ));
        } else if (type === 4) { // Odd One Out (Numbers)
             const m = Math.floor(Math.random() * 5) + 3;
             const correct = (m * 4 + 1).toString();
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Find the odd one out.`,
                 correct,
                 [(m*2).toString(), (m*3).toString(), (m*5).toString()],
                 `Others are multiples of ${m}.`
             ));
        } else if (type === 5) { // Blood Relations
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `A is the father of B. C is the sister of B. How is C related to A?`,
                 "Daughter",
                 ["Mother", "Aunt", "Niece"],
                 `B is A's child. C is B's sister, so C is also A's child (Daughter).`
             ));
        } else if (type === 6) { // Ranking
             const total = Math.floor(Math.random() * 30) + 10;
             const posTop = Math.floor(Math.random() * 5) + 3;
             // Total = Top + Bottom - 1 => Bottom = Total - Top + 1
             const posBot = total - posTop + 1;
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `In a class of ${total} students, Ravi is ranked ${posTop}th from the top. What is his rank from the bottom?`,
                 `${posBot}th`,
                 [`${posBot-1}th`, `${posBot+1}th`, `${total-posTop}th`],
                 `Formula: Total = Top + Bottom - 1. ${total} = ${posTop} + Bottom - 1.`
             ));
        } else if (type === 7) { // Word Analogy (Generated from small list)
             const pairs = [
                 ["Pen", "Write", "Knife", "Cut"],
                 ["Eye", "See", "Ear", "Hear"],
                 ["Bird", "Fly", "Fish", "Swim"],
                 ["Doctor", "Hospital", "Teacher", "School"],
                 ["Car", "Road", "Train", "Track"],
                 ["Cobbler", "Shoe", "Baker", "Bread"]
             ];
             const pair = pairs[Math.floor(Math.random() * pairs.length)];
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `${pair[0]} is to ${pair[1]} as ${pair[2]} is to ?`,
                 pair[3],
                 ["Walk", "Sleep", "Eat", "Run"].filter(x => x !== pair[3]).slice(0,3),
                 `${pair[0]} is used to/associated with ${pair[1]}.`
             ));
        } else if (type === 8) { // Dictionary Order
             const words = ["Apple", "Application", "Apartment", "Ape"];
             // Sort: Apartment, Ape, Apple, Application
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Which word comes first in the dictionary?`,
                 "Apartment",
                 ["Apple", "Application", "Ape"],
                 `Alphabetical order: Apartment -> Ape -> Apple -> Application.`
             ));
        } else if (type === 9) { // Reverse Alphabet
             // If A=26, B=25... what is D?
             // D is 4th, so 27-4 = 23
             const letter = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A-E
             const val = 27 - (letter.charCodeAt(0) - 64);
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `If Z=1, Y=2... what is the value of ${letter}?`,
                 `${val}`,
                 [`${val+1}`, `${val-1}`, `${letter.charCodeAt(0)-64}`],
                 `Reverse rank = 27 - Actual rank.`
             ));
        } else if (type === 10) { // Day calc
             // If today is Monday, what day is it after 7 days?
             const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
             const startIdx = Math.floor(Math.random() * 7);
             const gap = [7, 14, 21][Math.floor(Math.random() * 3)];
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `If today is ${days[startIdx]}, what day will it be after ${gap} days?`,
                 days[startIdx],
                 [days[(startIdx+1)%7], days[(startIdx+2)%7], days[(startIdx+3)%7]],
                 `After exactly ${gap} days (multiple of 7), the day repeats.`
             ));
        } else { // 11: Venn Logic
             questions.push(createQuestionWithRandomOptions(
                 id,
                 `Which diagram best represents: Fruit, Apple, Banana?`,
                 "One big circle with two small separate circles",
                 ["Three separate circles", "Three intersecting circles", "One circle inside another inside another"],
                 `Apple and Banana are both Fruits, but separate from each other.`
             ));
        }
    }
    return questions;
};

// --- STATIC POOLS (Expanded) ---
const ENGLISH_POOL: Omit<Question, 'id'>[] = [
    { text: "Synonym of 'Happy'", options: ["Joyful", "Sad", "Angry", "Dull"], correctAnswerIndex: 0, explanation: "Joyful means happy." },
    { text: "Antonym of 'Brave'", options: ["Cowardly", "Strong", "Bold", "Smart"], correctAnswerIndex: 0, explanation: "Cowardly is opposite of Brave." },
    { text: "Plural of 'Mouse'", options: ["Mice", "Mouses", "Mouse", "Mices"], correctAnswerIndex: 0, explanation: "Mice is irregular plural." },
    { text: "Past tense of 'Go'", options: ["Went", "Gone", "Goes", "Going"], correctAnswerIndex: 0, explanation: "Go -> Went." },
    { text: "Synonym of 'Fast'", options: ["Quick", "Slow", "Lazy", "Late"], correctAnswerIndex: 0, explanation: "Quick means fast." },
    { text: "Antonym of 'Win'", options: ["Lose", "Victory", "Gain", "Get"], correctAnswerIndex: 0, explanation: "Lose is opposite of Win." },
    { text: "A group of Fish is called?", options: ["School", "Herd", "Pack", "Pride"], correctAnswerIndex: 0, explanation: "A school of fish." },
    { text: "Young one of Dog?", options: ["Puppy", "Kitten", "Cub", "Calf"], correctAnswerIndex: 0, explanation: "Puppy." },
    { text: "Correct spelling?", options: ["Calendar", "Calender", "Calander", "Calandar"], correctAnswerIndex: 0, explanation: "Calendar." },
    { text: "Which is a Vowel?", options: ["A", "B", "C", "D"], correctAnswerIndex: 0, explanation: "A, E, I, O, U are vowels." },
    { text: "Verb in 'He runs fast'?", options: ["Runs", "He", "Fast", "The"], correctAnswerIndex: 0, explanation: "Runs is the action." },
    { text: "Adjective in 'Red car'?", options: ["Red", "Car", "Is", "A"], correctAnswerIndex: 0, explanation: "Red describes the car." },
    { text: "Opposite of 'Day'?", options: ["Night", "Morning", "Noon", "Evening"], correctAnswerIndex: 0, explanation: "Night." },
    { text: "Synonym of 'Big'?", options: ["Huge", "Small", "Tiny", "Little"], correctAnswerIndex: 0, explanation: "Huge." },
    { text: "Plural of 'Tooth'?", options: ["Teeth", "Tooths", "Teethes", "Tooth"], correctAnswerIndex: 0, explanation: "Teeth." },
    { text: "Gender of 'King'?", options: ["Masculine", "Feminine", "Neuter", "Common"], correctAnswerIndex: 0, explanation: "King is male." },
    { text: "Feminine of 'Lion'?", options: ["Lioness", "Tiger", "Lions", "She-Lion"], correctAnswerIndex: 0, explanation: "Lioness." },
    { text: "Article: '___ apple'?", options: ["An", "A", "The", "No article"], correctAnswerIndex: 0, explanation: "An apple." },
    { text: "Homophone of 'Son'?", options: ["Sun", "Soon", "San", "Sin"], correctAnswerIndex: 0, explanation: "Sun." },
    { text: "Rhyme for 'Pen'?", options: ["Hen", "Pan", "Pin", "Pun"], correctAnswerIndex: 0, explanation: "Hen." },
    { text: "Cry of a Lion?", options: ["Roar", "Bark", "Mew", "Quack"], correctAnswerIndex: 0, explanation: "Lions roar." },
    { text: "House of a Horse?", options: ["Stable", "Den", "Shed", "Nest"], correctAnswerIndex: 0, explanation: "Stable." },
    { text: "Opposite of 'Rich'?", options: ["Poor", "Wealthy", "Strong", "Weak"], correctAnswerIndex: 0, explanation: "Poor." },
    { text: "Past of 'Eat'?", options: ["Ate", "Eaten", "Eating", "Eats"], correctAnswerIndex: 0, explanation: "Ate." },
    { text: "Plural of 'Baby'?", options: ["Babies", "Babys", "Babyes", "Babyies"], correctAnswerIndex: 0, explanation: "Babies." },
    { text: "Adverb in 'He ran quickly'?", options: ["Quickly", "Ran", "He", "Fast"], correctAnswerIndex: 0, explanation: "Quickly modifies the verb." },
    { text: "Pronoun in 'She is nice'?", options: ["She", "Is", "Nice", "The"], correctAnswerIndex: 0, explanation: "She replaces the noun." },
    { text: "Preposition: 'Book ___ table'?", options: ["On", "In", "At", "Of"], correctAnswerIndex: 0, explanation: "On the table." },
    { text: "Conjunction: 'Tea ___ Coffee'?", options: ["And", "But", "So", "Because"], correctAnswerIndex: 0, explanation: "And." },
    { text: "Superlative of 'Good'?", options: ["Best", "Better", "Goodest", "Great"], correctAnswerIndex: 0, explanation: "Good, Better, Best." },
    { text: "Synonym of 'Begin'?", options: ["Start", "End", "Finish", "Stop"], correctAnswerIndex: 0, explanation: "Start." },
    { text: "Antonym of 'Clean'?", options: ["Dirty", "Pure", "Neat", "Clear"], correctAnswerIndex: 0, explanation: "Dirty." },
    { text: "Person who teaches?", options: ["Teacher", "Doctor", "Pilot", "Chef"], correctAnswerIndex: 0, explanation: "Teacher." },
    { text: "Place for books?", options: ["Library", "Park", "Cinema", "Gym"], correctAnswerIndex: 0, explanation: "Library." },
    { text: "Young one of Cow?", options: ["Calf", "Kid", "Lamb", "Foal"], correctAnswerIndex: 0, explanation: "Calf." },
    { text: "Sound of Dog?", options: ["Bark", "Meow", "Hiss", "Chirp"], correctAnswerIndex: 0, explanation: "Bark." },
    { text: "Correct spelling?", options: ["Necessary", "Neccesary", "Necesary", "Neccessary"], correctAnswerIndex: 0, explanation: "Necessary." },
    { text: "Plural of 'Foot'?", options: ["Feet", "Foots", "Feets", "Footes"], correctAnswerIndex: 0, explanation: "Feet." },
    { text: "Opposite of 'Love'?", options: ["Hate", "Like", "Enjoy", "Care"], correctAnswerIndex: 0, explanation: "Hate." },
    { text: "Synonym of 'Gift'?", options: ["Present", "Prize", "Toy", "Box"], correctAnswerIndex: 0, explanation: "Present." },
    { text: "Feminine of 'Brother'?", options: ["Sister", "Mother", "Aunt", "Niece"], correctAnswerIndex: 0, explanation: "Sister." },
    { text: "Past of 'See'?", options: ["Saw", "Seen", "Seed", "Seeing"], correctAnswerIndex: 0, explanation: "Saw." },
    { text: "Article: '___ sun'?", options: ["The", "A", "An", "None"], correctAnswerIndex: 0, explanation: "The Sun (unique object)." },
    { text: "One who treats sick people?", options: ["Doctor", "Teacher", "Cobbler", "Baker"], correctAnswerIndex: 0, explanation: "Doctor." },
    { text: "Tool to cut paper?", options: ["Scissors", "Knife", "Axe", "Hammer"], correctAnswerIndex: 0, explanation: "Scissors." },
    { text: "Room for sleeping?", options: ["Bedroom", "Kitchen", "Bathroom", "Hall"], correctAnswerIndex: 0, explanation: "Bedroom." },
    { text: "Color of grass?", options: ["Green", "Red", "Blue", "Yellow"], correctAnswerIndex: 0, explanation: "Green." },
    { text: "Shape of an egg?", options: ["Oval", "Circle", "Square", "Triangle"], correctAnswerIndex: 0, explanation: "Oval." },
    { text: "Opposite of 'Full'?", options: ["Empty", "Half", "Filled", "Blank"], correctAnswerIndex: 0, explanation: "Empty." },
    { text: "Rhyme with 'Cake'?", options: ["Bake", "Cook", "Eat", "Bun"], correctAnswerIndex: 0, explanation: "Bake." },
    { text: "Synonym of 'Beautiful'?", options: ["Pretty", "Ugly", "Bad", "Plain"], correctAnswerIndex: 0, explanation: "Pretty." },
    { text: "Antonym of 'Buy'?", options: ["Sell", "Take", "Get", "Keep"], correctAnswerIndex: 0, explanation: "Sell." },
    { text: "Group of Birds?", options: ["Flock", "Herd", "Swarm", "Pack"], correctAnswerIndex: 0, explanation: "Flock." },
    { text: "Young one of Cat?", options: ["Kitten", "Puppy", "Cub", "Joey"], correctAnswerIndex: 0, explanation: "Kitten." },
    { text: "Correct spelling?", options: ["Believe", "Beleive", "Belive", "Beeleve"], correctAnswerIndex: 0, explanation: "Believe." },
    { text: "Vowel in 'Cat'?", options: ["a", "C", "t", "none"], correctAnswerIndex: 0, explanation: "a." },
    { text: "Verb in 'Birds fly'?", options: ["Fly", "Birds", "The", "In"], correctAnswerIndex: 0, explanation: "Fly." },
    { text: "Adjective in 'Tall tree'?", options: ["Tall", "Tree", "A", "Is"], correctAnswerIndex: 0, explanation: "Tall." },
    { text: "Opposite of 'Hard'?", options: ["Soft", "Tough", "Solid", "Rough"], correctAnswerIndex: 0, explanation: "Soft." },
    { text: "Synonym of 'Speak'?", options: ["Talk", "Listen", "Hear", "Walk"], correctAnswerIndex: 0, explanation: "Talk." },
    { text: "Plural of 'Man'?", options: ["Men", "Mans", "Manes", "Mens"], correctAnswerIndex: 0, explanation: "Men." }
];

const GK_POOL: Omit<Question, 'id'>[] = [
    { text: "Prime Minister of India (2024)?", options: ["Narendra Modi", "Rahul Gandhi", "Amit Shah", "Sonia Gandhi"], correctAnswerIndex: 0, explanation: "Narendra Modi." },
    { text: "Capital of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correctAnswerIndex: 0, explanation: "New Delhi." },
    { text: "National Bird of India?", options: ["Peacock", "Parrot", "Eagle", "Crow"], correctAnswerIndex: 0, explanation: "Peacock." },
    { text: "National Animal of India?", options: ["Tiger", "Lion", "Elephant", "Deer"], correctAnswerIndex: 0, explanation: "Tiger." },
    { text: "National Flower of India?", options: ["Lotus", "Rose", "Lily", "Sunflower"], correctAnswerIndex: 0, explanation: "Lotus." },
    { text: "Largest state in India (Area)?", options: ["Rajasthan", "UP", "MP", "Maharashtra"], correctAnswerIndex: 0, explanation: "Rajasthan." },
    { text: "Smallest state in India?", options: ["Goa", "Sikkim", "Kerala", "Tripura"], correctAnswerIndex: 0, explanation: "Goa." },
    { text: "Iron Man of India?", options: ["Sardar Patel", "Gandhi", "Nehru", "Bose"], correctAnswerIndex: 0, explanation: "Sardar Vallabhbhai Patel." },
    { text: "First PM of India?", options: ["Jawaharlal Nehru", "Gandhi", "Patel", "Shastri"], correctAnswerIndex: 0, explanation: "Nehru." },
    { text: "Who wrote Vande Mataram?", options: ["Bankim Chandra Chatterjee", "Tagore", "Premchand", "Prasad"], correctAnswerIndex: 0, explanation: "Bankim Chandra Chatterjee." },
    { text: "Highest mountain peak?", options: ["Mount Everest", "K2", "Kangchenjunga", "Makalu"], correctAnswerIndex: 0, explanation: "Mount Everest." },
    { text: "Longest river in India?", options: ["Ganga", "Yamuna", "Godavari", "Narmada"], correctAnswerIndex: 0, explanation: "Ganga." },
    { text: "Planet closest to Sun?", options: ["Mercury", "Venus", "Earth", "Mars"], correctAnswerIndex: 0, explanation: "Mercury." },
    { text: "Largest planet?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctAnswerIndex: 0, explanation: "Jupiter." },
    { text: "Which planet has rings?", options: ["Saturn", "Mars", "Earth", "Mercury"], correctAnswerIndex: 0, explanation: "Saturn." },
    { text: "Natural satellite of Earth?", options: ["Moon", "Sun", "Star", "Mars"], correctAnswerIndex: 0, explanation: "Moon." },
    { text: "Source of energy for Earth?", options: ["Sun", "Moon", "Stars", "Fire"], correctAnswerIndex: 0, explanation: "Sun." },
    { text: "Gas we breathe in?", options: ["Oxygen", "Nitrogen", "CO2", "Helium"], correctAnswerIndex: 0, explanation: "Oxygen." },
    { text: "Gas plants need?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswerIndex: 0, explanation: "Plants use CO2 for photosynthesis." },
    { text: "Freezing point of water?", options: ["0°C", "100°C", "50°C", "10°C"], correctAnswerIndex: 0, explanation: "0 degrees Celsius." },
    { text: "Number of bones in adult human?", options: ["206", "208", "300", "150"], correctAnswerIndex: 0, explanation: "206." },
    { text: "Hardest substance?", options: ["Diamond", "Gold", "Iron", "Silver"], correctAnswerIndex: 0, explanation: "Diamond." },
    { text: "Fastest land animal?", options: ["Cheetah", "Lion", "Tiger", "Horse"], correctAnswerIndex: 0, explanation: "Cheetah." },
    { text: "Largest mammal?", options: ["Blue Whale", "Elephant", "Giraffe", "Shark"], correctAnswerIndex: 0, explanation: "Blue Whale." },
    { text: "Ship of the Desert?", options: ["Camel", "Horse", "Donkey", "Elephant"], correctAnswerIndex: 0, explanation: "Camel." },
    { text: "King of the Jungle?", options: ["Lion", "Tiger", "Bear", "Wolf"], correctAnswerIndex: 0, explanation: "Lion." },
    { text: "Number of colors in rainbow?", options: ["7", "6", "5", "8"], correctAnswerIndex: 0, explanation: "7 (VIBGYOR)." },
    { text: "Festival of Lights?", options: ["Diwali", "Holi", "Eid", "Christmas"], correctAnswerIndex: 0, explanation: "Diwali." },
    { text: "Festival of Colors?", options: ["Holi", "Diwali", "Onam", "Pongal"], correctAnswerIndex: 0, explanation: "Holi." },
    { text: "Xmas is celebrated on?", options: ["25 Dec", "1 Jan", "15 Aug", "26 Jan"], correctAnswerIndex: 0, explanation: "25th December." },
    { text: "Independence Day of India?", options: ["15 August", "26 January", "2 October", "14 November"], correctAnswerIndex: 0, explanation: "15th August." },
    { text: "Republic Day of India?", options: ["26 January", "15 August", "2 October", "14 November"], correctAnswerIndex: 0, explanation: "26th January." },
    { text: "Gandhi Jayanti?", options: ["2 October", "14 November", "5 September", "15 August"], correctAnswerIndex: 0, explanation: "2nd October." },
    { text: "Teachers' Day?", options: ["5 September", "14 November", "2 October", "15 August"], correctAnswerIndex: 0, explanation: "5th September." },
    { text: "Children's Day?", options: ["14 November", "5 September", "26 January", "15 August"], correctAnswerIndex: 0, explanation: "14th November." },
    { text: "Current President of India?", options: ["Droupadi Murmu", "Ram Nath Kovind", "Pratibha Patil", "Kalam"], correctAnswerIndex: 0, explanation: "Droupadi Murmu." },
    { text: "Currency of India?", options: ["Rupee", "Dollar", "Yen", "Euro"], correctAnswerIndex: 0, explanation: "Indian Rupee (INR)." },
    { text: "Number of states in India?", options: ["28", "29", "27", "30"], correctAnswerIndex: 0, explanation: "28 States." },
    { text: "Smallest continent?", options: ["Australia", "Europe", "Asia", "Africa"], correctAnswerIndex: 0, explanation: "Australia." },
    { text: "Largest continent?", options: ["Asia", "Africa", "North America", "Europe"], correctAnswerIndex: 0, explanation: "Asia." },
    { text: "Largest ocean?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], correctAnswerIndex: 0, explanation: "Pacific Ocean." },
    { text: "Number of players in Cricket?", options: ["11", "10", "12", "9"], correctAnswerIndex: 0, explanation: "11." },
    { text: "National Game of India?", options: ["Hockey", "Cricket", "Football", "Tennis"], correctAnswerIndex: 0, explanation: "Hockey (De facto)." },
    { text: "Sachin Tendulkar plays?", options: ["Cricket", "Hockey", "Football", "Tennis"], correctAnswerIndex: 0, explanation: "Cricket." },
    { text: "Capital of USA?", options: ["Washington D.C.", "New York", "Los Angeles", "Chicago"], correctAnswerIndex: 0, explanation: "Washington D.C." },
    { text: "Capital of UK?", options: ["London", "Paris", "Berlin", "Rome"], correctAnswerIndex: 0, explanation: "London." },
    { text: "Capital of Japan?", options: ["Tokyo", "Kyoto", "Osaka", "Seoul"], correctAnswerIndex: 0, explanation: "Tokyo." },
    { text: "Eiffel Tower is in?", options: ["Paris", "London", "New York", "Rome"], correctAnswerIndex: 0, explanation: "Paris, France." },
    { text: "Taj Mahal is in?", options: ["Agra", "Delhi", "Jaipur", "Mumbai"], correctAnswerIndex: 0, explanation: "Agra." },
    { text: "Statue of Liberty is in?", options: ["New York", "Washington", "Paris", "London"], correctAnswerIndex: 0, explanation: "New York, USA." },
    { text: "Great Wall is in?", options: ["China", "India", "USA", "Russia"], correctAnswerIndex: 0, explanation: "China." },
    { text: "Pyramids are in?", options: ["Egypt", "India", "China", "Brazil"], correctAnswerIndex: 0, explanation: "Egypt." },
    { text: "Inventor of Telephone?", options: ["Graham Bell", "Edison", "Tesla", "Marconi"], correctAnswerIndex: 0, explanation: "Alexander Graham Bell." },
    { text: "Inventor of Light Bulb?", options: ["Edison", "Bell", "Tesla", "Newton"], correctAnswerIndex: 0, explanation: "Thomas Alva Edison." },
    { text: "Inventor of Computer?", options: ["Charles Babbage", "Pascal", "Gates", "Jobs"], correctAnswerIndex: 0, explanation: "Charles Babbage." },
    { text: "Brain of Computer?", options: ["CPU", "Monitor", "Mouse", "Keyboard"], correctAnswerIndex: 0, explanation: "CPU (Central Processing Unit)." },
    { text: "Rainbow colors acronym?", options: ["VIBGYOR", "RGB", "CMYK", "ROYGBIV"], correctAnswerIndex: 0, explanation: "VIBGYOR." },
    { text: "Baby of Kangaroo?", options: ["Joey", "Calf", "Cub", "Pup"], correctAnswerIndex: 0, explanation: "Joey." },
    { text: "Dozen means?", options: ["12", "10", "6", "20"], correctAnswerIndex: 0, explanation: "12." },
    { text: "Leap year days?", options: ["366", "365", "364", "360"], correctAnswerIndex: 0, explanation: "366 days." }
];

const getFromPoolSafe = (pool: Omit<Question, 'id'>[], count: number, prefix: string): Question[] => {
    const result: Question[] = [];
    for(let i=0; i<count; i++) {
        const template = pool[i % pool.length];
        const uniqueSuffix = Math.floor(Math.random() * 10000);
        // Copy options to shuffle them fresh for each instance
        const options = [...template.options];
        const correctText = options[template.correctAnswerIndex];
        
        // Shuffle
        const shuffled = options.sort(() => 0.5 - Math.random());
        const newIndex = shuffled.indexOf(correctText);
        
        result.push({
            id: `${prefix}-${Date.now()}-${i}-${uniqueSuffix}`,
            text: template.text,
            options: shuffled,
            correctAnswerIndex: newIndex,
            explanation: template.explanation
        });
    }
    return result;
}

export const getMockQuestions = (subject: Subject, count: number): Question[] => {
    switch (subject) {
      case Subject.MATHS:
        return generateMathQuestionsSafe(count);
      case Subject.REASONING:
        return generateReasoningQuestionsSafe(count);
      case Subject.ENGLISH:
        return getFromPoolSafe(ENGLISH_POOL, count, 'ENG');
      case Subject.GK:
        return getFromPoolSafe(GK_POOL, count, 'GK');
      default:
        return [];
    }
};