import type { Meta, StoryObj } from '@storybook/react';
import { SnsButton } from './SnsButton';

const meta: Meta<typeof SnsButton> = {
  title: 'Components/Common/Buttons/SnsButton',
  component: SnsButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '소셜 로그인을 위한 SNS 버튼 컴포넌트입니다. 네이버, 카카오, 구글 플랫폼을 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    platform: {
      control: { type: 'select' },
      options: ['naver', 'kakao', 'google'],
      description: '소셜 로그인 플랫폼 타입',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수',
    },
    className: {
      control: { type: 'text' },
      description: '추가적인 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    platform: 'naver',
    onClick: () => console.log('SNS 버튼 클릭!'),
  },
};

// 네이버 버튼
export const Naver: Story = {
  args: {
    platform: 'naver',
    onClick: () => console.log('네이버 로그인 클릭!'),
  },
  parameters: {
    docs: {
      description: {
        story: '네이버 소셜 로그인 버튼입니다.',
      },
    },
  },
};

// 카카오 버튼
export const Kakao: Story = {
  args: {
    platform: 'kakao',
    onClick: () => console.log('카카오 로그인 클릭!'),
  },
  parameters: {
    docs: {
      description: {
        story: '카카오 소셜 로그인 버튼입니다.',
      },
    },
  },
};

// 구글 버튼
export const Google: Story = {
  args: {
    platform: 'google',
    onClick: () => console.log('구글 로그인 클릭!'),
  },
  parameters: {
    docs: {
      description: {
        story: '구글 소셜 로그인 버튼입니다.',
      },
    },
  },
};

// 모든 버튼들을 한번에 보여주는 스토리
export const AllPlatforms: Story = {
  render: () => {
    const handleClick = (platform: string) => {
      console.log(`${platform} 로그인 클릭!`);
    };

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SnsButton 
          platform="naver" 
          onClick={() => handleClick('네이버')} 
        />
        <SnsButton 
          platform="kakao" 
          onClick={() => handleClick('카카오')} 
        />
        <SnsButton 
          platform="google" 
          onClick={() => handleClick('구글')} 
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모든 소셜 로그인 버튼들을 한번에 보여주는 예시입니다.',
      },
    },
  },
};

// 커스텀 클래스가 적용된 버튼
export const WithCustomClass: Story = {
  args: {
    platform: 'naver',
    onClick: () => console.log('커스텀 클래스 적용된 버튼 클릭!'),
    className: 'shadow-lg border-2 border-gray-300',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 CSS 클래스가 적용된 버튼입니다. 그림자와 테두리가 추가되었습니다.',
      },
    },
  },
};

// 다크 배경에서의 모습
export const OnDarkBackground: Story = {
  render: () => {
    const handleClick = (platform: string) => {
      console.log(`${platform} 로그인 클릭!`);
    };

    return (
      <div 
        style={{ 
          backgroundColor: '#000000', 
          padding: '32px', 
          borderRadius: '8px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SnsButton 
          platform="naver" 
          onClick={() => handleClick('네이버')} 
        />
        <SnsButton 
          platform="kakao" 
          onClick={() => handleClick('카카오')} 
        />
        <SnsButton 
          platform="google" 
          onClick={() => handleClick('구글')} 
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용되는 검은색 배경에서의 모습입니다.',
      },
    },
  },
};

// 다양한 크기의 버튼들
export const DifferentSizes: Story = {
  render: () => {
    const handleClick = (platform: string) => {
      console.log(`${platform} 로그인 클릭!`);
    };

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '12px' }}>Small (w-10 h-10)</p>
          <SnsButton 
            platform="naver" 
            onClick={() => handleClick('네이버')} 
            className="w-10 h-10"
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '12px' }}>Default (w-12 h-12)</p>
          <SnsButton 
            platform="kakao" 
            onClick={() => handleClick('카카오')} 
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '8px', fontSize: '12px' }}>Large (w-16 h-16)</p>
          <SnsButton 
            platform="google" 
            onClick={() => handleClick('구글')} 
            className="w-16 h-16"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 SNS 버튼들을 보여주는 예시입니다.',
      },
    },
  },
};
