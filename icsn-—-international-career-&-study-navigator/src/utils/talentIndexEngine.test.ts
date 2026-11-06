import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTalentDevelopmentIndex } from './talentIndexEngine';

test('calculateTalentDevelopmentIndex calculates development pillars without public leaderboard', () => {
  const profile = {
    gpa: 3.8,
    ieltsScore: 7.5,
  };
  const portfolio = {
    id: 'p1',
    studentId: 's1',
    isPublic: false,
    layoutTheme: 'modern' as const,
    headline: 'AI Enthusiast',
    aboutMe: 'Exploring machine learning algorithms and software architecture with passion.',
    education: [{ id: 'e1', institution: 'Lyceum', degree: 'Diploma', field: 'CS', startYear: '2023', endYear: '2026' }],
    skills: [
      { id: 'sk1', name: 'Python', category: 'Technical' as const },
      { id: 'sk2', name: 'C++', category: 'Technical' as const },
      { id: 'sk3', name: 'English', category: 'Languages' as const },
    ],
    projects: [
      {
        id: 'pr1',
        title: 'Robotics Rover',
        dateRange: '2026',
        description: 'Obstacle avoidance system.',
        tags: ['Robotics'],
        verified: true,
      },
    ],
    certificates: [],
    achievements: [{ id: 'a1', title: 'Olympiad Winner', dateRange: '2026', description: '2nd place', tags: ['Math'] }],
    volunteering: [{ id: 'v1', title: 'Peer Tutor', dateRange: '2025', description: 'Taught math', tags: ['Education'] }],
    internships: [],
    languages: [{ language: 'English', proficiency: 'Advanced' as const }, { language: 'Uzbek', proficiency: 'Native' as const }],
    externalLinks: [],
    lastUpdated: '2026-11-01',
  };

  const index = calculateTalentDevelopmentIndex(profile, portfolio);

  assert.equal(index.pillars.length, 5);
  assert.ok(index.overallReadinessTier === 'Global Ready' || index.overallReadinessTier === 'Distinguished');
  assert.ok(index.unlockedOpportunitiesCount >= 20);

  // Ensure each pillar has concrete strengths and milestone recommendations
  for (const pillar of index.pillars) {
    assert.ok(pillar.score >= 0 && pillar.score <= 100);
    assert.ok(pillar.strengths.length >= 1);
    assert.ok(pillar.recommendedMilestones.length >= 1);
  }
});
