What happens when arcade-style video games meet the esoteric functional
world of Haskell? Usually nothing! Time to figure out why that is and what
to do about it. This is a development blog for a game clevery titled Time
Bandit Clone which I am writing in Haskell.

[Time Bandit](http://www.atarimania.com/game-atari-st-time-bandit_10622.html)
is an old shooter game for early computers. Its gameplay is a mix between
Gauntlet and Pac-Man. You're encouraged to continue moving through each
maze-like level firing missiles at bad guys and collecting treasure. The goal
in each level is to make it to the exit. You have a choice between 20 "lands"
with 16 increasingly difficult stages each. An interesting ingredient to Time
Bandit are the text adventure elements which require the player to interact
with characters and objects in the style of Zork, by typing simple verb-object
commands.

![A medieval location in Time Bandit for Amiga](img/kings-crown.jpg "A medieval location in Time Bandit for Amiga")

Time Bandit is not a simple board game or guess-the-number game. It has fast
scrolling animations and complex interactions between gameplay elements. A
direct approach to implementing something like this would be brutal, especially
in Haskell. We have the tools necessary to establish new languages to better
model solutions to particular problems. But to do this we need to figure out
the essential structure behind a video game. I hope this blog will be useful
for documenting this sort of modeling activity.

Inspiration for this blog comes from [Conal Elliott's blog](http://conal.net/blog/), especially the parts about Functional Reactive
Programming, and from [Pawel Sobocinski's blog](https://graphicallinearalgebra.net/) about the category theory of linear
algebra. Both blogs explore abstract objects in a way that's interesting and
accessible to mere mortals.

## Posts

0. [Pong](0-pong.html) 
