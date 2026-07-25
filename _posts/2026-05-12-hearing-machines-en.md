---
lang: en
slug: hearing-machines
title: "What it means for a machine to hear"
date: 2026-05-12
read: 9
featured: true
tags: [auditory-perception, deep-learning]
excerpt: "Hearing is not recording. A microphone captures pressure; hearing is everything that happens after."
permalink: /blog/hearing-machines/
alt_url: /km/blog/hearing-machines/
---

A microphone captures pressure over time. Hearing is everything that happens after — the parsing of that one-dimensional signal into sources, locations, and meaning. When we say we want a machine to hear, we are asking for that whole stack, not the recording.

The first problem is separation. In any real room, the signal at the microphone is a sum: a voice, a fan, a door, a second voice, all overlapping in the same samples. Humans solve this so fluently we forget it is a problem at all. Machines have to be taught to pull the sum back apart.

The second problem is localization. Two ears, or two microphones, receive the same event at slightly different times and levels. That tiny difference is enough to place a sound in space. Getting a model to use it robustly — across rooms it has never heard — is where most of my work lives.

What remains is generalization. A system that listens well in one room usually fails the moment you move it. That gap, between the lab and the world, is the honest measure of whether a machine can really be said to hear.
