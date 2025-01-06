from ....game.models import *
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create multiple test users'

    def add_arguments(self, parser):
        # Add positional arguments
        parser.add_argument('player1', type=int, help='ID of Player 1')
        parser.add_argument('player2', type=int, help='ID of Player 2')
        parser.add_argument('player3', type=int, help='ID of Player 3')
        parser.add_argument('player4', type=int, help='ID of Player 4')
        parser.add_argument('win', type=int, help='win')


    def handle(self, *args, **kwargs):
        player1id = kwargs['player1']
        player2id = kwargs['player2']
        player3id = kwargs['player3']
        player4id = kwargs['player4']
        win = kwargs['win']
        try:
            player1 = User.objects.get(pk=player1id)
            player2 = User.objects.get(pk=player2id)
            player3 = User.objects.get(pk=player3id)
            player4 = User.objects.get(pk=player4id)
            tournament = Tournament.objects.create(player1=player1, player2=player2, player3=player3, player4=player4)
            half1 = tournament.get_or_create_half1()
            half2 = tournament.get_or_create_half2()
            
            half1.progress = 'E'
            half1.p1_score = 1
            half1.p2_score = 2
            half1.save()
            half1.setWinner()
            
            half2.progress = 'E'
            half2.p1_score = 1
            half2.p2_score = 2
            half2.save()
            half2.setWinner()
            final = tournament.get_or_create_final()
            if win:
                final.progress = 'E'
                final.p1_score = 1
                final.p2_score = 2
                final.save()
                final.setWinner()
            tournament.has_a_winner()
            self.stdout.write(self.style.SUCCESS(f"Game created {tournament}."))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Failed: {str(e)}"))