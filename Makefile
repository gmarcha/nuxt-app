######################################################################################################

NAME := tutor

# Use rules defined in this file to interact with the application.

######################################################################################################

DOCKER-COMPOSE := docker-compose
DOCKER-COMPOSE-PATH := ./docker-compose.yaml


all:		build up

re:			down all


build:
			$(DOCKER-COMPOSE) -p $(NAME) -f $(DOCKER-COMPOSE-PATH) \
				build

up:
			$(DOCKER-COMPOSE) -p $(NAME) -f $(DOCKER-COMPOSE-PATH) \
				up -d --remove-orphans

down:		
			$(DOCKER-COMPOSE) -p $(NAME) -f $(DOCKER-COMPOSE-PATH) \
				down

delete:		down
