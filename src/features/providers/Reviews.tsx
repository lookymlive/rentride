'use client';
import { ReviewCard } from '@/components/ReviewCard';
import { IResReviewProps } from '@/models/res.model';
import { Card, Divider, Text, Title } from '@mantine/core';

interface Props {
  reviews: IResReviewProps[];
}
export const Reviews = ({ reviews }: Props) => {
  return (
    <div>
      <Divider
        my="lg"
        label={
          <Title order={3} className="text-default">
            Reviews ({reviews.length})
          </Title>
        }
      />
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {reviews.length === 0 && (
        <Card my="3rem">
          <Text fs="italic" ta="center">
            No Reviews Available
          </Text>
        </Card>
      )}
    </div>
  );
};
