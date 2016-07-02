# Pongclarative

In Abelson and Sussman's great programming textbook *[SICP][1]* they discuss
the difference between declarative and imperative language. As an example
they give the definition of the square root of a number.

$\sqrt{x}$ = the $y$ such that $y \geq 0$ and $y^2 = x$

Then they give a "pseudo-lisp" implementation of square root based on this
definition.

```
(define (sqrt x)
        (the y (and (>= y 0)
                    (= (square y) x))))
```

"But that only begs the question," they say, and quickly remedy the situation
by showing a proper algorithm to get an approximate answer. At the time I
took this at face value. Of course programming is a totally different affair
from math, let's write some algorithms! But wait, what's really wrong with the
"the" version of the code? Instead of thinking too hard about that particular
issue, we will just assume it's fine and use it as inspiration.

In the last post I gave a somewhat vague description of the game Pong. That
description contains a few extraneous bits, like the net and the fact that
the score is displayed somewhere, which we can omit. It was also missing a
real emphasis on the game's two modes. So I reformulated the description for
the purposes of this post.

The strategy will be as follows: say the description in english, then parse
the text into a data structure. The data structure will be a tree of symbols.
For now the symbols will be uniquely identifiable but otherwise meaningless.
Finally we can go back and try to give a meaning to the symbols. The goal is:
the interpretation of the program will be a proper model of the game pong.

Ok! First the reformulated game description.

- The game has two modes, normal mode and attract mode.
- The game has a screen. Each of the two players is assigned to one side of
  the screen.
- Each player has a score.
- Each player has a bat and a control knob that controls the bats vertical
  position. The bat for a player is positioned horizontally near that player's
  side.
- There is a ball whose behavior may be described as uniform linear motion with
  instantaneous reflections at certain points. Additionally the ball may be
  taken out of play.
- The ball reflects off the screen top, screen bottom, and either bat.
- Additionally the ball reflects off the screen sides in attract mode.
- A bounce sound is triggered by the ball reflecting off a screen side.
- A hit sound is triggered by the ball reflecting off a bat.
- Until the ball reaches maximum speed, reflecting off a bat increases the ball
  speed incrementally.
- Inserting a coin in attract mode will reset the scores to zero, activate
  normal mode, and begin the serve procedure toward the right side.
- The serve procedure (toward a side) is:
    - remove the ball from play
    - wait a short time
    - then serve the ball at a low speed from the center of the screen generally
      toward that side
- A player scores when, in normal mode, the ball reaches the screen side
  opposite that player.
- Scoring triggers a score sound.
- When a player scores, the serve procedure begins (toward the opposite side).
- When either player's score reaches 11 then attract mode is activated.

Kind of tough but there it is. This time I carefully avoided involving any
aspects of the game that we can consider a presentational issue. As long as we
have a model of the above game, we can display it however we want. The next
challenge is to parse the description to get a pile of raw syntax. The format
I'll use looks like `symbol` or `symHead(sym1, sym2, ..., symN)`, and `sym_i`
is supposed to look like a subscript. I used symbol names with a future use in
mind, but for now just think of the symbols as meaningless distinguishable
placeholders.

***CRUNCH***

```
def(pong, game(
  modes(normalMode, attractMode),
  button(insertCoin),
  decl(screen, top, bottom, two(side)),
  decl(two(players)),
  forEach(players,
    side(screen),
    pointCount,
    bat,
    control(knob)
  ),
  is(horizontalPosition(bat_i), near(side_i)),
  controls(knob_i, verticalPosition(bat_i)),
  decl(ball),
  behavior(ball, either(
    uniformMotion(
      reflect(top(screen)),
      reflect(bottom(screen)),
      reflect(bat),
      attractMode(reflect(side(screen)))
    ),
    outOfPlay
  )),
  normalMode(
    sound(reflect(topOrBottom(screen)), bounceSound),
    sound(reflect(bat), hitSound)
  )
  while(
    speed(ball) < maxSpeed,
    on(reflect(bat), inc(speed(ball)))
  ),
  def(
    serve($side),
    do(
      set(ball, outOfPlay),
      wait(serveDelay),
      set(ball, motion(center(screen), $side, minSpeed))
    )
  ),
  on(
    attractMode(insertCoin),
    do(
      reset(both(score)),
      activateMode(normalMode),
      serve(rightSide(screen))
    )
  ),
  def(
    score(oppositeSide($side)),
    normalMode(reaches(ball, $side))
  ),
  normalMode(sound(score($eitherSide), scoreSound)),
  on(score($side), inc(pointCount(player($side)))),
  on(score($side), serve(oppositeSide($side))),
  on(score($eitherSide) == 11, activateMode(attractMode))
))
```

Gnarly. One potentially unusual thing to notice is I unapologetically used
imperative language to describe two parts of the game, and then parsed it as-is
into the syntax tree. Aren't imperative and declarative polar opposite
concepts? Of course not. But the final verdict on the value of this idea
will have to wait until we explain what the heck this gibberish means.

... which will have to wait!

[1]: https://mitpress.mit.edu/sicp/chapter1/node9.html
