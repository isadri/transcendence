from ....game.models import UserStats, Game
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create multiple test users'

    def add_arguments(self, parser):
        # Add positional arguments
        parser.add_argument('player1', type=int, help='ID of Player 1')
        parser.add_argument('player2', type=int, help='ID of Player 2')
        parser.add_argument('score1', type=int, help='Score of Player 1')
        parser.add_argument('score2', type=int, help='Score of Player 2')


    def handle(self, *args, **kwargs):
        player1id = kwargs['player1']
        player2id = kwargs['player2']
        score1 = kwargs['score1']
        score2 = kwargs['score2']
        try:
            player1 = User.objects.get(pk=player1id)
            player2 = User.objects.get(pk=player2id)
            game = Game.objects.create(player1=player1, player2=player2, progress='E', p1_score=score1, p2_score=score2)
            game.setWinner()
            self.stdout.write(self.style.SUCCESS(f"Game created {game}."))
        except:
            self.stdout.write(self.style.WARNING(f"Failed"))