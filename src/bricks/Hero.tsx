import { RichText, Text, types } from 'react-bricks/frontend';

const Hero: types.Brick = () => {
  return (
    <div className="py-12 bg-gray-900 text-white text-center">
      <Text
        propName="title"
        renderBlock={(props) => (
          <h1 className="text-4xl font-bold">{props.children}</h1>
        )}
        placeholder="Digite um titulo..."
      />
      <RichText
        propName="description"
        renderBlock={(props) => (
          <p className="mt-4 text-lg">{props.children}</p>
        )}
        placeholder="Digite uma descricao..."
        allowedFeatures={[
          types.RichTextFeatures.Bold,
          types.RichTextFeatures.Highlight,
        ]}
      />
    </div>
  );
};

Hero.schema = {
  name: 'hero-section',
  label: 'Hero',
  getDefaultProps: () => ({
    title: 'Bem-vindo ao Duoloot',
    description: 'Edite este texto visualmente.',
  }),
};

export default Hero;
